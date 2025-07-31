'use client';

import PreviousNavigation from '@/components/PreviousNavigation';
import { Button } from '@/components/ui/button';
import ChevronDown2Icon from '@/libs/shared/icons/ChevronDown2';
import Connection2Icon from '@/libs/shared/icons/Connection2';
import MinuteIcon from '@/libs/shared/icons/Minute';
import PlusIcon from '@/libs/shared/icons/Plus';
import SearchIcon from '@/libs/shared/icons/Search';
import WalletIcon from '@/libs/shared/icons/Wallet';
import { useState } from 'react';

interface TreeNode {
  id: string;
  level: number;
  label: string;
  type: 'folder' | 'share' | 'more';
  children?: TreeNode[];
  isExpanded?: boolean;
}

const initialData: TreeNode[] = [
  {
    id: '1',
    level: 1,
    label: '0x51...7A',
    type: 'folder',
    children: [],
  },
  {
    id: '2',
    level: 1,
    label: '0x51...7A',
    type: 'folder',
    children: [],
  },
  {
    id: '3',
    level: 1,
    label: '0x51...7A',
    type: 'folder',
    children: [],
  },
  {
    id: '4',
    level: 1,
    label: '0x51...7A',
    type: 'folder',
    children: [],
  },
  {
    id: '5',
    level: 1,
    label: '0x51...7A',
    type: 'folder',
    children: [],
  },
  {
    id: '6',
    level: 1,
    label: '0x51...7A',
    type: 'folder',
    children: [],
  },
  {
    id: '7',
    level: 1,
    label: 'Chia sẻ link',
    type: 'share',
    children: [],
  },
  {
    id: '8',
    level: 1,
    label: 'Xem tiếp',
    type: 'more',
    children: [],
  },
];

export default function Tree() {
  const [treeData, setTreeData] = useState<TreeNode[]>(initialData);

  const generateChildNode = (parentLevel: number, parentId: string, index: number): TreeNode => {
    const childLevel = parentLevel + 1;
    return {
      id: `${parentId}-${index}`,
      level: childLevel,
      label: '0x51...7A',
      type: 'folder',
      children: [],
    };
  };

  const expandNode = (nodeId: string) => {
    const updateNode = (nodes: TreeNode[]): TreeNode[] => {
      return nodes.map((node) => {
        if (node.id === nodeId && node.level < 9) {
          const newChildren = node.children || [];
          if (newChildren.length === 0) {
            // Add multiple children when expanding
            for (let i = 1; i <= 7; i++) {
              newChildren.push(generateChildNode(node.level, node.id, i));
            }
            // Add share and more options
            newChildren.push({
              id: `${node.id}-share`,
              level: node.level + 1,
              label: 'Chia sẻ link',
              type: 'share',
              children: [],
            });
            newChildren.push({
              id: `${node.id}-more`,
              level: node.level + 1,
              label: 'Xem tiếp',
              type: 'more',
              children: [],
            });
          }
          return {
            ...node,
            isExpanded: !node.isExpanded,
            children: newChildren,
          };
        }
        if (node.children) {
          return {
            ...node,
            children: updateNode(node.children),
          };
        }
        return node;
      });
    };

    setTreeData(updateNode(treeData));
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
        {/* Connecting lines */}
        <div className="flex items-center gap-3 mb-3" style={{ marginLeft: `${marginLeft}px` }}>
          {/* Level indicator */}
          <span className="text-white text-sm font-medium min-w-[1px] w-[15px]">
            Lv.
            {node.level}
          </span>

          {/* Connecting line */}
          <div className="w-5 h-px bg-white translate-x-1" />

          {/* Node content */}
          <Button className={`${getButtonColor(node.type)} rounded-lg py-2 flex items-center min-w-[100px] w-[105px]`}>
            {renderIcon(node.type)}
            <span className="text-white text-[0.625rem] font-[700] -translate-x-4">{node.label}</span>
          </Button>

          {/* Expand button */}
          {node.level < 9 && (
            <Button
              onClick={() => expandNode(node.id)}
              className="tree-button-3 size-10"
            >
              {!node.isExpanded ? <PlusIcon className="translate-y-1 " /> : <MinuteIcon className="translate-y-1" />}
            </Button>
          )}
        </div>

        {/* Render children */}
        {node.isExpanded && node.children && (
          <div className="relative">
            {/* Vertical line for children */}
            {node.children.length > 0 && (
              <div
                className="absolute w-px bg-white"
                style={{
                  left: `${marginLeft + 40}px`,
                  top: '8px',
                  height: `${node.children.length * 48 + 8}px`,
                }}
              />
            )}
            {node.children.map((child, index) => renderTreeNode(child, index === node.children!.length - 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className="relative"
    >
      {/* Dark overlay for better contrast */}

      <div className="relative z-10 overflow-x-auto p-8">
        <div className="flex flex-col items-center mb-8">
          <PreviousNavigation isReload />
          <h2 className="text-shadow-custom text-[1rem] font-[274]">Hành trình kết nối</h2>
          <h1 className="text-shadow-custom text-[1.25rem] font-[700]">Sơ đồ hệ thống</h1>
          <SearchIcon className="absolute right-3" />
        </div>
        <div className="min-w-max">

          <div className="space-y-2 min-w-max">
            {treeData.map((node, index) => renderTreeNode(node, index === treeData.length - 1))}
          </div>
        </div>
      </div>
    </div>
  );
}
