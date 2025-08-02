/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useBoxTree } from '@/app/http/queries/useBox';
import { boxRequest } from '@/app/http/requests/box';
import PreviousNavigation from '@/components/PreviousNavigation';
import { Button } from '@/components/ui/button';
import useGetCookie from '@/hooks/useGetCookie';
import { formatAddress2 } from '@/libs/shared/constants/globals';
import ChevronDown2Icon from '@/libs/shared/icons/ChevronDown2';
import Connection2Icon from '@/libs/shared/icons/Connection2';
import MinuteIcon from '@/libs/shared/icons/Minute';
import PlusIcon from '@/libs/shared/icons/Plus';
import SearchIcon from '@/libs/shared/icons/Search';
import WalletIcon from '@/libs/shared/icons/Wallet';
import { handleClipboardCopy, isClient } from '@/libs/utils';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type User = {
  _id: string;
  address: string;
};

type TreeNode = {
  id: string;
  level: number;
  originalAddress: string;
  address: string;
  type: 'folder' | 'share' | 'more';
  children?: TreeNode[];
  isExpanded?: boolean;
};

type TreeData = {
  lv1: TreeNode[];
};

export default function Tree() {
  const hasFetched = useRef(false);
  const [address, setAddress] = useState<string>('');

  const [currentFetchingAddress, setCurrentFetchingAddress] = useState<string>('');

  const queryClient = useQueryClient();

  // ✅ Now this will be reactive
  const isFetching
   = queryClient.isFetching({ queryKey: ['boxTree', currentFetchingAddress] }) > 0 || false;

  const [treeDataV2, setTreeDataV2] = useState<TreeData>({ lv1: [] });
  const dataCookie = useGetCookie();

  useEffect(() => {
    (async () => {
      const authData = await dataCookie('authData');
      if (authData) {
        setAddress(authData.address);
      }
    })();
  }, []);

  const { data, isSuccess, isLoading: isInitialLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useBoxTree(address);

  const urlSharing = isClient ? `${window.location.origin}/login` : '';

  const fetchInitialTreeData = () => {
    const treeLength = data.length || 0;
    const treeDataV2Initial: TreeNode[] = [];

    for (let i = 0; i < 9; i++) {
      if (i < treeLength) {
        treeDataV2Initial.push({
          id: data[i]?._id || `root-${i}`,
          level: 1,
          originalAddress: data[i]?.address || '',
          address: formatAddress2(data[i]?.address || ''),
          type: 'folder',
          children: [],
        });
      } else {
        treeDataV2Initial.push({
          id: `root-share-${i}`,
          level: 1,
          originalAddress: address,
          address: 'Chia sẻ',
          type: 'share',
        });
      }
    }
    hasFetched.current = true;
    setTreeDataV2({
      lv1: treeDataV2Initial
    });
  };

  const fetchChildrenTreeData = async (childrenAddress: string, initialPage = 1): Promise<User[]> => {
    try {
      // ✅ Set loading state before fetch
      setCurrentFetchingAddress(childrenAddress);

      const childrenData = await queryClient.fetchInfiniteQuery({
        queryKey: ['boxTree', childrenAddress],
        queryFn: async ({ pageParam = initialPage }) => {
          const response = await boxRequest.boxTree({
            address: childrenAddress,
            page: pageParam as number,
          });

          if (response instanceof Error) {
            throw response;
          }

          return response;
        },
        initialPageParam: initialPage,
        getNextPageParam: (lastPage: any) => {
          const currentPage = lastPage?.result.pagination.page;
          const totalPages = lastPage?.result.pagination.pageTotal;
          if (!currentPage || !totalPages) {
            return undefined;
          }
          if (currentPage < totalPages) {
            return currentPage + 1;
          }
          return undefined;
        },
      });

      const childrenDataList = childrenData?.pages.flatMap((page: any) => page.result.users) || [];
      return childrenDataList;
    } catch (error) {
      console.error('Error fetching children:', error);
      return [];
    } finally {
      // ✅ Clear loading state after fetch
      setCurrentFetchingAddress('');
    }
  };

  useEffect(() => {
    if (isSuccess && data && !hasFetched.current) {
      fetchInitialTreeData();
    }
  }, [address, isSuccess]);

  const generateChildNode = (parentLevel: number, parentId: string, childData: User, index: number): TreeNode => {
    return {
      id: childData._id || `${parentId}-child-${index}`,
      level: parentLevel + 1,
      originalAddress: childData.address,
      address: formatAddress2(childData.address),
      type: 'folder',
      children: [],
      isExpanded: false,
    };
  };

  const updateNodeRecursively = (nodes: TreeNode[], targetAddress: string, newChildren: TreeNode[]): TreeNode[] => {
    return nodes.map((node) => {
      if (node.originalAddress === targetAddress) {
        return {
          ...node,
          isExpanded: !node.isExpanded,
          children: node.isExpanded ? [] : newChildren,
        };
      }

      if (node.children && node.children.length > 0) {
        return {
          ...node,
          children: updateNodeRecursively(node.children, targetAddress, newChildren),
        };
      }

      return node;
    });
  };

  const expandNode = async (nodeAddress: string) => {
    const findNode = (nodes: TreeNode[]): TreeNode | null => {
      for (const node of nodes) {
        if (node.originalAddress === nodeAddress) {
          return node;
        }
        if (node.children) {
          const found = findNode(node.children);
          if (found) {
            return found;
          }
        }
      }
      return null;
    };

    const targetNode = findNode(treeDataV2.lv1);

    if (!targetNode) {
      console.error('Node not found:', nodeAddress);
      return;
    }

    if (targetNode.isExpanded) {
      setTreeDataV2(prevTreeData => ({
        ...prevTreeData,
        lv1: updateNodeRecursively(prevTreeData.lv1, nodeAddress, [])
      }));
      return;
    }

    if (!targetNode.children || targetNode.children.length === 0) {
      const nodeData = await fetchChildrenTreeData(nodeAddress);
      const newChildren: TreeNode[] = [];

      for (let i = 0; i < 9; i++) {
        if (i < nodeData.length) {
          const childNode = generateChildNode(targetNode.level, targetNode.id, nodeData[i] ?? { _id: '', address: '' }, i);
          newChildren.push(childNode);
        } else {
          newChildren.push({
            id: `${targetNode.id}-share-${i}`,
            level: targetNode.level + 1,
            originalAddress: nodeAddress,
            address: 'Chia sẻ',
            type: 'share',
            children: [],
          });
        }
      }

      setTreeDataV2(prevTreeData => ({
        ...prevTreeData,
        lv1: updateNodeRecursively(prevTreeData.lv1, nodeAddress, newChildren)
      }));
    } else {
      setTreeDataV2(prevTreeData => ({
        ...prevTreeData,
        lv1: updateNodeRecursively(prevTreeData.lv1, nodeAddress, targetNode.children!)
      }));
    }
  };

  const renderIcon = (type: string) => {
    switch (type) {
      case 'share':
        return <Connection2Icon className="translate-y-1" />;
      case 'more':
        return <ChevronDown2Icon className="translate-y-1" />;
      default:
        return <WalletIcon className="size-12 translate-y-1 text-white" />;
    }
  };

  const getButtonColor = (type: string) => {
    switch (type) {
      case 'share':
        return 'tree-button-2';
      case 'more':
        return 'tree-button-2';
      default:
        return 'tree-button';
    }
  };

  const renderTreeNode = (node: TreeNode, _isLast = false) => {
    const marginLeft = (node.level - 1) * 50;
    return (
      <div key={node.id} className="relative">
        <div className="flex items-center gap-3 mb-3" style={{ marginLeft: `${marginLeft}px` }}>
          <span className="text-white text-sm font-medium min-w-[1px] w-[15px]">
            Lv.
            {node.level}
          </span>

          <div className="w-5 h-px bg-white translate-x-1" />

          <Button
            className={`${getButtonColor(node.type)} rounded-lg py-2 flex items-center min-w-[100px] w-[105px]`}
            onClick={() => node.type === 'share' && handleClipboardCopy(`${urlSharing}?invitedBy=${node.originalAddress}`)}
          >
            {renderIcon(node.type)}
            <span className="text-white text-[0.625rem] font-[700] -translate-x-4">{node.address}</span>
          </Button>

          {/* ✅ Show loading state for individual nodes */}
          {node.level < 9 && node.type === 'folder' && (
            <Button
              onClick={() => expandNode(node.originalAddress)}
              className="tree-button-3 size-10"
              disabled={isFetching} // ✅ Disable when loading
            >
              {isFetching ? (
                <Loader2 className="animate-spin size-4" />
              ) : (
                !node.isExpanded ? <PlusIcon className="translate-y-1" /> : <MinuteIcon className="translate-y-1" />
              )}
            </Button>
          )}
        </div>

        {node.isExpanded && node.children && node.children.length > 0 && (
          <div className="relative">
            <div
              className="absolute w-px bg-white"
              style={{
                left: `${marginLeft + 40}px`,
                top: '8px',
                height: `${node.children.length * 48 + 8}px`,
              }}
            />
            {node.children.map((child, index) =>
              renderTreeNode(child, index === node.children!.length - 1)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative">
      <div className="relative z-10 overflow-x-auto p-8">
        <div className="flex flex-col items-center mb-8">
          <PreviousNavigation isReload />
          <h2 className="text-shadow-custom text-[1rem] font-[274]">Hành trình kết nối</h2>
          <h1 className="text-shadow-custom text-[1.25rem] font-[700]">Sơ đồ hệ thống</h1>
          <SearchIcon className="absolute right-3" />
        </div>
        <div className="min-w-max">
          <div className="space-y-2 min-w-max">
            {/* ✅ Show global loader only for initial loading */}
            {isInitialLoading ? (
              <Loader2 className="animate-spin text-white fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            ) : (
              treeDataV2.lv1.map((node, index) => renderTreeNode(node, index === treeDataV2.lv1.length - 1))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
