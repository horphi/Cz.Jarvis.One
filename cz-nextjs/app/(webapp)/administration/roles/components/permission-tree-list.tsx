// components/permission-list.tsx
import { IPermission } from '@/types/roles/i-permission';
import { useEffect, useState } from 'react';

// type PermissionItem = {
//     name: string;
//     displayName: string;
//     parentName: string | null;
//     level: number;
// };

type PermissionNode = {
    name: string;
    displayName: string;
    parentName: string | null;
    level: number;
    children: PermissionNode[];
    parent: PermissionNode | null;
};

export default function PermissionTreeList({
    selectedPermissions,
    onSelect,
}: {
    selectedPermissions: string[];
    onSelect: (perms: string[]) => void;
}) {
    const [tree, setTree] = useState<PermissionNode[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const response = await fetch(
                    "/api/administration/permission/get-all-permissions",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch permissions");
                }

                const result = await response.json();

                const items: IPermission[] = result.data;


                const buildTree = (items: IPermission[]): PermissionNode[] => {
                    const nodeMap = new Map<string, PermissionNode>();
                    const rootNodes: PermissionNode[] = [];

                    // First pass: Create all nodes first
                    items.forEach(item => {
                        const node: PermissionNode = {
                            ...item,
                            children: [],
                            parent: null,
                        };
                        nodeMap.set(node.name, node);
                    });

                    // Second pass: Build hierarchy
                    items.forEach(item => {
                        const node = nodeMap.get(item.name)!;
                        if (item.parentName) {
                            const parent = nodeMap.get(item.parentName);
                            if (parent) {
                                node.parent = parent;
                                parent.children.push(node);
                            }
                        } else {
                            rootNodes.push(node);
                        }
                    });

                    return rootNodes;
                };

                const treeData = buildTree(items);
                setTree(treeData);
            } catch (error) {
                console.error("Error fetching permissions:", error);
                setError("Failed to load permissions. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchPermissions();
    }, []);

    const getAllDescendants = (node: PermissionNode): PermissionNode[] => {
        let descendants: PermissionNode[] = [];
        for (const child of node.children) {
            descendants.push(child);
            descendants = descendants.concat(getAllDescendants(child));
        }
        return descendants;
    };

    const handleToggle = (node: PermissionNode) => {
        const isSelected = selectedPermissions.includes(node.name);
        const newSelected = new Set(selectedPermissions);

        if (isSelected) {
            // Deselect logic
            newSelected.delete(node.name);
            getAllDescendants(node).forEach(desc => newSelected.delete(desc.name));

            // Check ancestors
            let current = node.parent;
            while (current) {
                const hasSelectedChildren = current.children.some(child =>
                    newSelected.has(child.name)
                );
                if (!hasSelectedChildren) {
                    newSelected.delete(current.name);
                }
                current = current.parent;
            }
        } else {
            // Select logic
            newSelected.add(node.name);
            getAllDescendants(node).forEach(desc => newSelected.add(desc.name));

            // Select all ancestors
            let current = node.parent;
            while (current) {
                newSelected.add(current.name);
                current = current.parent;
            }
        }

        onSelect(Array.from(newSelected));
    };

    const renderTree = (nodes: PermissionNode[]) => (
        <ul className="pl-4">
            {nodes.map(node => (
                <li key={node.name} className="py-1">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={selectedPermissions.includes(node.name)}
                            onChange={() => handleToggle(node)}
                            className="w-4 h-4"
                        />
                        <span className="text-sm">{node.displayName}</span>
                    </label>
                    {node.children.length > 0 && renderTree(node.children)}
                </li>
            ))}
        </ul>
    );

    if (loading) {
        return <div className="p-4 text-gray-500 flex justify-center items-center h-full">Loading permissions...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-500 flex justify-center items-center h-full">{error}</div>;
    }

    return (
        <div className="border rounded-lg p-4 h-fit flex flex-col">
            <div className="flex-1 overflow-auto">
                {renderTree(tree)}
            </div>
        </div>
    );
}