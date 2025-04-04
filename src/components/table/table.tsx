import React, { useState, useMemo } from 'react';
import { TableConfig, ColumnConfig, OrderBy } from './table.types';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

interface TableProps<T> {
    config: TableConfig<T>;
    data: T[];
    onOrderChange?: (orderBy: OrderBy) => void;
    onFilterChange?: (key: string, value: string) => void;
}

export function Table<T>({ config, data, onOrderChange, onFilterChange }: TableProps<T>) {
    const [filters, setFilters] = useState<Record<string, string>>({});
    const [orderBy, setOrderBy] = useState<OrderBy | undefined>(config.currentByDefault);
    const [currentPage, setCurrentPage] = useState(config.pagination.currentPage);
    const itemsPerPage = config.pagination.itemsPerPage;

    const filteredData = useMemo(() => {
        let result = [...data];
        
        if (Object.keys(filters).length > 0) {
            result = result.filter(row => {
                return Object.entries(filters).every(([key, value]) => {
                    if (!value) return true;
                    const cellValue = String(row[key as keyof T]).toLowerCase();
                    return cellValue.includes(value.toLowerCase());
                });
            });
        }
        
        if (orderBy) {
            result.sort((a, b) => {
                const aValue = a[orderBy.key as keyof T];
                const bValue = b[orderBy.key as keyof T];
                
                if (orderBy.orderby === 'asc') {
                    return aValue > bValue ? 1 : -1;
                } else {
                    return aValue < bValue ? 1 : -1;
                }
            });
        }
        
        return result;
    }, [data, filters, orderBy]);

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredData.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredData, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const handleOrder = (key: string) => {
        const newOrderBy: OrderBy = {
            key,
            orderby: orderBy?.key === key && orderBy.orderby === 'asc' ? 'desc' : 'asc'
        };
        setOrderBy(newOrderBy);
        onOrderChange?.(newOrderBy);
    };

    const handleFilterChange = (key: string, value: string) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onFilterChange?.(key, value);
        setCurrentPage(1);
    };

    const getSortIcon = (key: string) => {
        if (orderBy?.key !== key) return <FaSort />;
        return orderBy.orderby === 'asc' ? <FaSortUp /> : <FaSortDown />;
    };

    const renderCellValue = (value: any, type: ColumnConfig['type']) => {
        if (value === undefined || value === null) return '';
        
        switch (type) {
            case 'Date':
                return new Date(value).toLocaleDateString();
            default:
                return String(value);
        }
    };

    const changePage = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);
        
        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }
        
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        
        return pages;
    };

    return (
        <div className="table-container">
            <table className="table">
                <thead>
                    <tr>
                        {config.headers.map(column => (
                            <th 
                                key={column.key} 
                                onClick={() => column.ordinable && handleOrder(column.key)}
                                className={column.ordinable ? 'sortable' : ''}
                            >
                                <div className="header-content">
                                    <span>{column.columnName}</span>
                                    {column.ordinable && (
                                        <span className="sort-icon">
                                            {getSortIcon(column.key)}
                                        </span>
                                    )}
                                </div>
                                
                                {column.filtrable && (
                                    <input
                                        type="text"
                                        value={filters[column.key] || ''}
                                        onChange={(e) => handleFilterChange(column.key, e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                        placeholder={`Filter ${column.columnName}`}
                                        className="filter-input"
                                    />
                                )}
                            </th>
                        ))}
                        {config.actions?.actions.length && <th>Actions</th>}
                    </tr>
                </thead>
                
                <tbody>
                    {paginatedData.map((row, index) => (
                        <tr key={index}>
                            {config.headers.map(column => (
                                <td key={column.key}>
                                    {renderCellValue(row[column.key as keyof T], column.type)}
                                </td>
                            ))}
                            
                            {config.actions?.actions.length && (
                                <td>
                                    {config.actions.actions
                                        .filter(action => 
                                            !action.visible || action.visible(row)
                                        )
                                        .map((action, i) => (
                                            <button
                                                key={i}
                                                onClick={() => action.onClick(row)}
                                                className="action-button"
                                            >
                                                {action.name}
                                            </button>
                                        ))
                                    }
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
            
            <div className="pagination">
                <button 
                    onClick={() => changePage(currentPage - 1)} 
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                
                {getPageNumbers().map(page => (
                    <span
                        key={page}
                        onClick={() => changePage(page)}
                        className={page === currentPage ? 'active' : ''}
                    >
                        {page}
                    </span>
                ))}
                
                <button 
                    onClick={() => changePage(currentPage + 1)} 
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
}