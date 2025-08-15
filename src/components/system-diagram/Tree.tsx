/* eslint-disable */
/* eslint-disable ts/no-use-before-define */
/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useBoxTree } from '@/app/http/queries/useBox';
import { boxRequest } from '@/app/http/requests/box';
import PreviousNavigation from '@/components/PreviousNavigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useGetCookie from '@/hooks/useGetCookie';
import ChevronDown2Icon from '@/libs/shared/icons/ChevronDown2';
import Connection2Icon from '@/libs/shared/icons/Connection2';
import GiftIcon from '@/libs/shared/icons/Gift';
import MinuteIcon from '@/libs/shared/icons/Minute';
import PlusIcon from '@/libs/shared/icons/Plus';
import SearchIcon from '@/libs/shared/icons/Search';
import Search2Icon from '@/libs/shared/icons/Search2';
import WalletIcon from '@/libs/shared/icons/Wallet';
import { formatAddress, handleClipboardCopy, isClient } from '@/libs/utils';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type User = {
  _id: string;
  address: string;
};

type PaginationData = {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

type TreeNode = {
  id: string;
  level: number;
  originalAddress: string;
  address: string;
  type: 'folder' | 'share' | 'more' | 'previous';
  children?: TreeNode[];
  isExpanded?: boolean;
  paginationData?: PaginationData;
};

type BoxData = {
  nodes: TreeNode[];
  isLoading: boolean;
  error: string | null;
  pagination?: PaginationData;
  totalUsers?: number;
};

type TreeData = {
  [key: string]: BoxData;
};

// Constants
const BOX_COUNT = 9;
const ITEMS_PER_BOX = 9;
const MAX_LEVEL = 9;

// Tính toán limit cho mỗi box
const getBoxLimit = (boxNumber: number) => 9 ** boxNumber;

export default function Tree() {
  // State management
  const [address, setAddress] = useState<string>('');
  const [currentFetchingAddress, setCurrentFetchingAddress] = useState<string>('');
  const [treeData, setTreeData] = useState<TreeData>({});
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);

  // Refs
  const searchRef = useRef<HTMLInputElement>(null);
  const loadingRef = useRef<{ [key: string]: boolean }>({});

  // Hooks
  const queryClient = useQueryClient();
  const { handleGetCookie } = useGetCookie();

  // Computed values
  const isFetching = useMemo(() =>
    queryClient.isFetching({ queryKey: ['box-tree', currentFetchingAddress] }) > 0, [queryClient, currentFetchingAddress]);

  const urlSharing = useMemo(() =>
    isClient ? `${window.location.origin}/login` : '', []);

  // Initialize tree data only once
  const initializeTreeData = useCallback(() => {
    const initialTreeData: TreeData = {};
    for (let i = 1; i <= BOX_COUNT; i++) {
      initialTreeData[`box${i}`] = {
        nodes: [],
        isLoading: false,
        error: null,
        totalUsers: 0
      };
    }
    return initialTreeData;
  }, []);

  // Get user address from cookie once
  useEffect(() => {
    let isMounted = true;

    const getAuthData = async () => {
      try {
        const authData = await handleGetCookie('authData');
        if (authData && isMounted) {
          const userAddress = (authData as { address: string })?.address;
          if (userAddress && !address) { // Chỉ set khi address chưa có
            setAddress(userAddress);
          }
        }
      } catch (error) {
        console.error('Error getting auth data:', error);
      }
    };

    // Chỉ get auth data khi chưa có address
    if (!address) {
      getAuthData();
    }

    return () => {
      isMounted = false;
    };
  }, []); // Remove dependencies để chỉ chạy một lần

  // Initialize tree data once
  useEffect(() => {
    setTreeData(initializeTreeData());
  }, []); // Remove dependency để chỉ chạy một lần

  const {
    isLoading: isInitialLoading,
    isError,
    error
  } = useBoxTree(address, { enabled: !!address });

  // Utility functions
  const isCurrentFetching = useCallback((targetAddress: string) => {
    return currentFetchingAddress === targetAddress;
  }, [currentFetchingAddress]);

  const createPaginationData = useCallback((pagination: any): PaginationData => ({
    currentPage: pagination.page || 1,
    totalPages: pagination.pageTotal || 1,
    hasNext: (pagination.page || 1) < (pagination.pageTotal || 1),
    hasPrevious: (pagination.page || 1) > 1
  }), []);

  // Prevent duplicate API calls
  const preventDuplicateCall = useCallback((key: string) => {
    if (loadingRef.current[key]) {
      return true;
    }
    loadingRef.current[key] = true;
    return false;
  }, []);

  const clearLoadingFlag = useCallback((key: string) => {
    delete loadingRef.current[key];
  }, []);

  // Fetch data cho một box cụ thể với caching
  const fetchBoxData = useCallback(async (
    boxNumber: number,
    page: number = 1,
    targetAddress?: string
  ): Promise<boolean> => {
    const currentAddress = targetAddress || address;
    if (!currentAddress) {
      return false;
    }

    const cacheKey = `${currentAddress}-box${boxNumber}-page${page}`;

    // Prevent duplicate calls
    if (preventDuplicateCall(cacheKey)) {
      return false;
    }

    try {
      setCurrentFetchingAddress(`${currentAddress}-box${boxNumber}`);

      // Update loading state
      setTreeData(prev => ({
        ...prev,
        [`box${boxNumber}`]: {
          ...prev[`box${boxNumber}`],
          isLoading: true,
          error: null,
          nodes: [],
        }
      }));

      const limit = getBoxLimit(boxNumber);

      // Single API call per box
      const response = await boxRequest.boxTree({
        address: currentAddress,
        page: 1,
        limit
      });

      if (response instanceof Error) {
        throw response;
      }

      const { users: allUsers, pagination } = response?.result || {};
      if (!allUsers || !pagination) {
        return false;
      }

      // Calculate users for this specific box and page
      let users: User[];
      let totalUsersForBox = 0;

      if (boxNumber === 1) {
        // Box 1: first 9 items only
        users = allUsers.slice(0, ITEMS_PER_BOX);
        totalUsersForBox = Math.min(allUsers.length, ITEMS_PER_BOX);
      } else {
        // Other boxes: calculate offset based on previous boxes
        const previousBoxLimit = 9 ** (boxNumber - 1);
        const availableUsers = allUsers.slice(previousBoxLimit);
        totalUsersForBox = availableUsers.length;

        // Users for current page
        const startIndex = (page - 1) * ITEMS_PER_BOX;
        const endIndex = startIndex + ITEMS_PER_BOX;
        users = availableUsers.slice(startIndex, endIndex);
      }

      // Calculate pagination for boxes with pagination (box 2+)
      let boxPagination = pagination;
      if (boxNumber > 1) {
        const totalPagesForBox = Math.ceil(totalUsersForBox / ITEMS_PER_BOX);
        boxPagination = {
          ...pagination,
          page,
          pageTotal: totalPagesForBox
        };
      }

      // Build nodes
      const nodes = buildBoxNodes(users, boxPagination, boxNumber, page, totalUsersForBox, currentAddress);

      // Update tree data
      setTreeData(prev => ({
        ...prev,
        [`box${boxNumber}`]: {
          ...prev[`box${boxNumber}`],
          nodes,
          pagination: boxNumber > 1 ? createPaginationData(boxPagination) : undefined,
          totalUsers: totalUsersForBox,
          isLoading: false,
          error: null
        }
      }));

      return true;
    } catch (error) {
      console.error(`Error fetching box ${boxNumber} data:`, error);

      setTreeData(prev => ({
        ...prev,
        [`box${boxNumber}`]: {
          ...prev[`box${boxNumber}`],
          isLoading: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          nodes: [],
        }
      }));

      return false;
    } finally {
      setCurrentFetchingAddress('');
      clearLoadingFlag(cacheKey);
    }
  }, [address, preventDuplicateCall, clearLoadingFlag, createPaginationData]);

  // Build tree nodes cho một box
  const buildBoxNodes = useCallback((
    users: User[],
    pagination: any,
    boxNumber: number,
    page: number = 1,
    totalUsersForBox: number = 0,
    currentAddress?: string
  ): TreeNode[] => {
    const nodeAddress = currentAddress || address;
    const nodes: TreeNode[] = [];
    const hasPagination = boxNumber > 1;

    if (hasPagination) {
      const paginationData = createPaginationData(pagination);
      const { hasPrevious } = paginationData;

      // Check if there are more than 9 items
      const hasMoreThan9Items = totalUsersForBox > ITEMS_PER_BOX;
      const hasNext = page * ITEMS_PER_BOX < totalUsersForBox;

      // Previous button at the top
      if (hasPrevious) {
        nodes.push({
          id: `box${boxNumber}-previous-${page}`,
          level: 1,
          originalAddress: nodeAddress,
          address: 'Trước',
          type: 'previous',
          paginationData: {
            ...paginationData,
            hasNext
          }
        });
      }

      // User nodes (max 9 items)
      const displayUsers = users.slice(0, ITEMS_PER_BOX);
      displayUsers.forEach((user, index) => {
        nodes.push({
          id: user._id || `box${boxNumber}-user-${page}-${index}`,
          level: 1,
          originalAddress: user.address,
          address: formatAddress(user.address, 2),
          type: 'folder',
          children: [],
          isExpanded: false
        });
      });

      // More button at the bottom
      if (hasNext && hasMoreThan9Items) {
        nodes.push({
          id: `box${boxNumber}-more-${page}`,
          level: 1,
          originalAddress: nodeAddress,
          address: 'Tiếp',
          type: 'more',
          paginationData: {
            ...paginationData,
            hasNext
          }
        });
      }

      // Fill remaining slots with share buttons
      const usedSlots = displayUsers.length + (hasPrevious ? 1 : 0) + (hasNext && hasMoreThan9Items ? 1 : 0);
      const remainingSlots = Math.max(0, ITEMS_PER_BOX - usedSlots);

      for (let i = 0; i < remainingSlots; i++) {
        nodes.push({
          id: `box${boxNumber}-share-${page}-${i}`,
          level: 1,
          originalAddress: nodeAddress,
          address: 'Chia sẻ',
          type: 'share'
        });
      }
    } else {
      // Box 1: no pagination
      const displayUsers = users.slice(0, ITEMS_PER_BOX);
      displayUsers.forEach((user, index) => {
        nodes.push({
          id: user._id || `box1-user-${index}`,
          level: 1,
          originalAddress: user.address,
          address: formatAddress(user.address, 2),
          type: 'folder',
          children: [],
          isExpanded: false
        });
      });

      // Fill remaining slots with share buttons
      const remainingSlots = ITEMS_PER_BOX - displayUsers.length;
      for (let i = 0; i < remainingSlots; i++) {
        nodes.push({
          id: `box1-share-${i}`,
          level: 1,
          originalAddress: nodeAddress,
          address: 'Chia sẻ',
          type: 'share'
        });
      }
    }

    return nodes;
  }, [address, createPaginationData]);

  // Load all boxes data efficiently với debounce
  const loadAllBoxes = useCallback(async (targetAddress: string) => {
    if (!targetAddress) {
      return;
    }

    // Kiểm tra xem đã load cho address này chưa
    const addressKey = `loaded-${targetAddress}`;
    if (loadingRef.current[addressKey]) {
      return;
    }

    loadingRef.current[addressKey] = true;

    try {
      // Reset tree data cho address mới
      setTreeData(initializeTreeData());

      // Sequential loading to avoid overwhelming the API
      for (let i = 1; i <= BOX_COUNT; i++) {
        await fetchBoxData(i, 1, targetAddress);
      }
    } catch (error) {
      console.error('Error loading boxes:', error);
    }
  }, [initializeTreeData]);

  // Handle pagination for box
  const handleBoxPagination = useCallback(async (
    boxNumber: number,
    action: 'next' | 'previous'
  ) => {
    const boxData = treeData[`box${boxNumber}`];
    if (!boxData?.pagination) {
      return;
    }

    const currentPage = boxData.pagination.currentPage;
    const newPage = action === 'next' ? currentPage + 1 : currentPage - 1;

    if (newPage < 1 || newPage > boxData.pagination.totalPages) {
      return;
    }

    await fetchBoxData(boxNumber, newPage, address);
  }, [treeData, fetchBoxData, address]);

  // Fetch children for node expansion
  const fetchChildrenPage = useCallback(async (
    parentAddress: string,
    parentId: string,
    parentLevel: number,
    page: number
  ) => {
    const cacheKey = `children-${parentAddress}-${page}`;

    if (preventDuplicateCall(cacheKey)) {
      return;
    }

    try {
      setCurrentFetchingAddress(parentAddress);

      const response = await boxRequest.boxTree({
        address: parentAddress,
        page,
        limit: ITEMS_PER_BOX
      });

      if (response instanceof Error) {
        throw response;
      }

      const { users, pagination } = response?.result || {};
      if (!users || !pagination) {
        return;
      }

      const children = buildChildrenNodes(users, pagination, parentId, parentLevel, parentAddress);
      updateNodeChildren(parentAddress, children);
    } finally {
      setCurrentFetchingAddress('');
      clearLoadingFlag(cacheKey);
    }
  }, [preventDuplicateCall, clearLoadingFlag]);

  // Build children nodes
  const buildChildrenNodes = useCallback((
    users: User[],
    pagination: any,
    parentId: string,
    parentLevel: number,
    parentAddress: string
  ): TreeNode[] => {
    const children: TreeNode[] = [];
    const paginationData = createPaginationData(pagination);
    const { hasPrevious, hasNext } = paginationData;

    if (hasPrevious) {
      children.push({
        id: `${parentId}-previous-${pagination.page}`,
        level: parentLevel + 1,
        originalAddress: parentAddress,
        address: 'Trước',
        type: 'previous',
        paginationData
      });
    }

    users.slice(0, ITEMS_PER_BOX).forEach((user, index) => {
      children.push({
        id: user._id || `${parentId}-child-${index}`,
        level: parentLevel + 1,
        originalAddress: user.address,
        address: formatAddress(user.address, 2),
        type: 'folder',
        children: [],
        isExpanded: false
      });
    });

    if (hasNext) {
      children.push({
        id: `${parentId}-more-${pagination.page}`,
        level: parentLevel + 1,
        originalAddress: parentAddress,
        address: 'Tiếp',
        type: 'more',
        paginationData
      });
    }

    const currentLength = children.length - (hasPrevious ? 1 : 0) - (hasNext ? 1 : 0);
    const remainingSlots = ITEMS_PER_BOX - currentLength;
    for (let i = 0; i < remainingSlots; i++) {
      children.push({
        id: `${parentId}-share-${i}`,
        level: parentLevel + 1,
        originalAddress: parentAddress,
        address: 'Chia sẻ',
        type: 'share'
      });
    }

    return children;
  }, [createPaginationData]);

  // Tree manipulation functions
  const updateNodeRecursively = useCallback((
    nodes: TreeNode[],
    targetAddress: string,
    newChildren: TreeNode[],
    forceExpand = false
  ): TreeNode[] => {
    return nodes.map((node) => {
      if (node.originalAddress === targetAddress && node.type === 'folder') {
        return {
          ...node,
          isExpanded: forceExpand || !node.isExpanded,
          children: forceExpand ? newChildren : (node.isExpanded ? [] : newChildren)
        };
      }

      if (node.children?.length) {
        return {
          ...node,
          children: updateNodeRecursively(node.children, targetAddress, newChildren, forceExpand)
        };
      }

      return node;
    });
  }, []);

  const updateNodeChildren = useCallback((targetAddress: string, newChildren: TreeNode[]) => {
    setTreeData((prevData) => {
      const updatedData = { ...prevData };
      Object.keys(updatedData).forEach((boxKey) => {
        if (updatedData[boxKey] && updatedData[boxKey].nodes) {
          updatedData[boxKey] = {
            ...updatedData[boxKey],
            nodes: updateNodeRecursively(updatedData[boxKey].nodes, targetAddress, newChildren, true)
          };
        }
      });
      return updatedData;
    });
  }, [updateNodeRecursively]);

  const findNodeInTree = useCallback((
    nodes: TreeNode[],
    predicate: (node: TreeNode) => boolean
  ): TreeNode | null => {
    for (const node of nodes) {
      if (predicate(node)) {
        return node;
      }
      if (node.children) {
        const found = findNodeInTree(node.children, predicate);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }, []);

  const findParentOfNode = useCallback((targetNode: TreeNode): { parent: TreeNode | null; boxNumber: number } => {
    for (let i = 1; i <= BOX_COUNT; i++) {
      const boxNodes = treeData[`box${i}`]?.nodes || [];
      const parent = findNodeInTree(boxNodes, node =>
        node.children?.some(child => child.id === targetNode.id) ?? false);
      if (parent) {
        return { parent, boxNumber: i };
      }
    }
    return { parent: null, boxNumber: 0 };
  }, [treeData, findNodeInTree]);

  // Event handlers
  const toggleNode = useCallback(async (node: TreeNode) => {
    if (node.isExpanded) {
      setTreeData((prevData) => {
        const updatedData = { ...prevData };
        Object.keys(updatedData).forEach((boxKey) => {
          if (updatedData[boxKey]?.nodes) { // Add optional chaining to safely access 'nodes'
            updatedData[boxKey] = {
              ...updatedData[boxKey],
              nodes: updateNodeRecursively(updatedData[boxKey].nodes, node.originalAddress, [])
            };
          }
        });
        return updatedData;
      });
    } else {
      await fetchChildrenPage(node.originalAddress, node.id, node.level, 1);
    }
  }, [fetchChildrenPage, updateNodeRecursively]);

  const handleNodeAction = useCallback(async (node: TreeNode, boxNumber?: number) => {
    switch (node.type) {
      case 'share':
        handleClipboardCopy(`${urlSharing}?invitedBy=${node.originalAddress}`);
        break;

      case 'more':
        if (node.level === 1 && boxNumber) {
          await handleBoxPagination(boxNumber, 'next');
        } else {
          const { parent } = findParentOfNode(node);
          if (parent) {
            const currentPage = node.paginationData?.currentPage || 1;
            await fetchChildrenPage(
              parent.originalAddress,
              parent.id,
              parent.level,
              currentPage + 1
            );
          }
        }
        break;

      case 'previous':
        if (node.level === 1 && boxNumber) {
          await handleBoxPagination(boxNumber, 'previous');
        } else {
          const { parent } = findParentOfNode(node);
          if (parent) {
            const currentPage = node.paginationData?.currentPage || 1;
            await fetchChildrenPage(
              parent.originalAddress,
              parent.id,
              parent.level,
              currentPage - 1
            );
          }
        }
        break;

      case 'folder':
        await toggleNode(node);
        break;
    }
  }, [urlSharing, handleBoxPagination, findParentOfNode, fetchChildrenPage, toggleNode]);

  const handleSearchAddress = useCallback(() => {
    if (!isSearching) {
      setIsSearching(true);
    } else {
      const searchValue = searchRef.current?.value?.trim();
      if (!searchValue) {
        return;
      }

      // Clear all loading flags and reset states
      loadingRef.current = {};
      setIsDataLoaded(false);
      setCurrentFetchingAddress('');

      // Set new address và load data ngay lập tức
      setAddress(searchValue);
      setIsSearching(false);
      searchRef.current?.blur();

      // Load data cho address mới ngay lập tức
      setTimeout(() => {
        loadAllBoxes(searchValue);
      }, 100); // Small delay để đảm bảo state đã update
    }
  }, [isSearching, loadAllBoxes]);

  // Load data when address changes (chỉ cho lần đầu từ cookie)
  useEffect(() => {
    if (address && !isDataLoaded && Object.keys(loadingRef.current).length === 0) {
      loadAllBoxes(address);
      setIsDataLoaded(true);
    }
  }, [address, isDataLoaded, loadAllBoxes]);

  // Render functions
  const renderIcon = useCallback((type: string) => {
    switch (type) {
      case 'share':
        return <Connection2Icon className="translate-y-1" />;
      case 'more':
        return <ChevronDown2Icon className="translate-y-1" />;
      case 'previous':
        return <ChevronDown2Icon className="-translate-y-1 rotate-180" />;
      default:
        return <WalletIcon className="size-12 translate-y-1 text-white" />;
    }
  }, []);

  const getButtonColor = useCallback((type: string) => {
    switch (type) {
      case 'share':
      case 'more':
      case 'previous':
        return 'tree-button-2';
      default:
        return 'tree-button';
    }
  }, []);

  const renderTreeNode = useCallback((node: TreeNode, boxNumber?: number) => {
    const marginLeft = (node.level - 1) * 50;
    // const isLoading = isCurrentFetching(node.originalAddress)
    //   || (node.type === 'more');

    return (
      <div key={node.id} className="relative">
        <div className="flex items-center gap-3 mb-3 w-[250px]" style={{ marginLeft: `${marginLeft}px` }}>
          <span className="text-white text-sm font-medium min-w-[1px] w-[15px]">
            Lv.
            {node.level}
          </span>

          <div className="w-5 h-px bg-white translate-x-1" />

          <Button
            className={`${getButtonColor(node.type)} rounded-lg py-2 flex items-center min-w-[100px] w-[105px]`}
            onClick={() => handleNodeAction(node, boxNumber)}
          >
            {renderIcon(node.type)}
            <span className="text-white text-[0.625rem] font-[700] -translate-x-4">
              {node.address}
            </span>
          </Button>

          {node.level < MAX_LEVEL && node.type === 'folder' && (
            <Button
              onClick={() => toggleNode(node)}
              className="tree-button-3 size-10"
              disabled={isFetching}
            >
              {isCurrentFetching(node.originalAddress) ? (
                <Loader2 className="animate-spin size-4" />
              ) : (
                !node.isExpanded
                  ? <PlusIcon className="translate-y-1" />
                  : <MinuteIcon className="translate-y-1" />
              )}
            </Button>
          )}
        </div>

        {node.isExpanded && node.children?.length && (
          <div className="relative">
            <div
              className="absolute w-px bg-white"
              style={{
                left: `${marginLeft + 40}px`,
                top: '8px',
                height: `${node.children.length * 48 + 8}px`,
              }}
            />
            {node.children.map(child => renderTreeNode(child))}
          </div>
        )}
      </div>
    );
  }, [
    isCurrentFetching,
    getButtonColor,
    handleNodeAction,
    renderIcon,
    toggleNode,
    isFetching
  ]);

  // Error handling
  if (isError) {
    return (
      <div className="text-white text-center h-[calc(100vh-170px)] flex flex-col items-center justify-center gap-4">
        <p className="text-lg font-bold">Không tìm thấy dữ liệu</p>
        <p className="text-sm">
          {error?.message || 'Vui lòng thử lại sau.'}
        </p>
        <div>
          <Button
            className="button-base"
            onClick={() => window.location.reload()}
          >
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 overflow-x-auto p-4">
      {/* Header */}
      <div className="flex flex-col items-center mb-8">
        <PreviousNavigation isReload />

        {!isSearching && (
          <>
            <h2 className="text-shadow-custom text-[1rem] font-[274]">
              Hành trình kết nối
            </h2>
            <h1 className="text-shadow-custom text-[1.25rem] font-[700]">
              Sơ đồ hệ thống
            </h1>
          </>
        )}

        {/* Search */}
        <div className={`absolute right-3 ${isSearching ? 'w-4/5' : 'w-0'} transition-all duration-300 -translate-y-1`}>
          <div className="relative">
            <button
              type="button"
              onClick={handleSearchAddress}
              className="absolute right-0 z-20"
            >
              {isSearching ? <Search2Icon /> : <SearchIcon />}
            </button>
            <Input
              className={`absolute top-0 border ${isSearching ? 'h-11 block' : 'h-0 hidden'} text-white rounded-full pe-10`}
              onKeyDown={e => e.key === 'Enter' && handleSearchAddress()}
              ref={searchRef}
              placeholder="Nhập địa chỉ ví"
              style={{
                background: 'linear-gradient(180deg, rgba(104, 218, 242, 0.50) 0%, rgba(28, 91, 185, 0.50) 95.1%)'
              }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      {!isSearching && (
        <div className="h-[calc(100vh-100px)] overflow-y-scroll">
          {isInitialLoading && !isDataLoaded ? (
            <Loader2 className="animate-spin text-white fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          ) : (
            <div>
              {Array.from({ length: BOX_COUNT }, (_, index) => {
                const boxNumber = index + 1;
                const boxKey = `box${boxNumber}`;
                const boxData = treeData[boxKey];

                if (!boxData) {
                  return null;
                }

                return (
                  <div key={boxKey} className="mb-8">
                    <div className="flex items-center translate-y-2">
                      <GiftIcon className="z-50" />
                      <span className="text-shadow-custom -translate-x-[6px] -translate-y-[7px]">
                        Box
                        {' '}
                        {boxNumber}
                      </span>
                    </div>
                    <div className="translate-x-5 w-[calc(100vh-500px)] translate-x-auto">
                      {boxData.isLoading ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="animate-spin text-white" />
                        </div>
                      ) : boxData.error ? (
                        <div className="text-red-400 py-4">
                          Error:
                          {' '}
                          {boxData.error}
                        </div>
                      ) : (
                        boxData.nodes?.map(node => renderTreeNode(node, boxNumber))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
