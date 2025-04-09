import React, { useState, useMemo } from 'react';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

import './table.css'; 
export function Table({ config, data, onOrderChange, onFilterChange, onActionClick }) {
    const [filters, setFilters] = useState({});
    const [orderBy, setOrderBy] = useState(config.currentByDefault || {});
    const [currentPage, setCurrentPage] = useState(config.pagination?.currentPage || 1);
    const itemsPerPage = config.pagination?.itemsPerPage || 10; 

    const transformedData = useMemo(() => {
        return data?.map(item => ({ ...item })) || [];
    }, [data]);

    const filteredData = useMemo(() => {
      let result = transformedData;

        if (Object.keys(filters).length > 0) {
            result = result.filter(row => {
                return Object.entries(filters).every(([key, value]) => {
                    if (!value) return true;
                    const cellValue = row[key] !== undefined && row[key] !== null ? String(row[key]).toLowerCase() : '';
                    return cellValue.includes(String(value).toLowerCase()); 
                });
            });
        }

        if (orderBy && orderBy.key && config.headers.find(h => h.key === orderBy.key)?.ordinable) {
             result.sort((a, b) => {
                 const aValue = a[orderBy.key];
                 const bValue = b[orderBy.key];

                 if (aValue == null && bValue == null) return 0;
                 if (aValue == null) return 1;
                 if (bValue == null) return -1;

                 const comparison = aValue > bValue ? 1 : (aValue < bValue ? -1 : 0);

                 return orderBy.orderby === 'asc' ? comparison : -comparison;
             });
         }

        return result;
    }, [transformedData, filters, orderBy]); 

    const paginatedData = useMemo(() => {
        if (!filteredData) return [];
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredData.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredData, currentPage, itemsPerPage]);

    const totalPages = filteredData ? Math.ceil(filteredData.length / itemsPerPage) : 0;

    const handleOrder = (key) => {
        const columnConfig = config.headers.find(h => h.key === key);
        if (!columnConfig || !columnConfig.ordinable) return; 

        const newOrderBy = {
            key,
            orderby: orderBy?.key === key && orderBy.orderby === 'asc' ? 'desc' : 'asc'
        };
        setOrderBy(newOrderBy);
        onOrderChange?.(newOrderBy); 
    };

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onFilterChange?.(key, value); 
        setCurrentPage(1); 
    };

    const getSortIcon = (key) => {
        if (orderBy?.key !== key) return <FaSort />;
        return orderBy.orderby === 'asc' ? <FaSortUp /> : <FaSortDown />;
    };


    const renderCellValue = (row, column) => {
        const value = row[column.key];
        if (value === undefined || value === null) return '-'; 

        switch (column.type) {
            case 'Date':
                try {
                    const date = new Date(value);
                    return !isNaN(date.getTime()) ? date.toLocaleDateString('it-IT') : 'Data non valida';
                } catch (e) {
                    return 'Data non valida';
                }
            case 'Number':
                 return String(value);
            default:
                return String(value);
        }
    };


    const changePage = (page) => {
        if (page < 1 || page > totalPages || page === currentPage) return;
        setCurrentPage(page);
    };

    const getPageNumbers = () => {
        if (totalPages <= 1) return [];

        const pages = [];
        const delta = 1;
        const left = currentPage - delta;
        const right = currentPage + delta + 1;
        let range = [];
        let rangeWithDots = [];

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= left && i < right)) {
                range.push(i);
            }
        }

        let l; 
                for (let i of range) {
            if (l) {
                if (i - l === 2) { 
                    rangeWithDots.push(l + 1);
                } else if (i - l !== 1) {
                    rangeWithDots.push('...');
                }
            }
            rangeWithDots.push(i);
            l = i;
        }

        return rangeWithDots;
    };


    const hasActions = config.actions?.actions && config.actions.actions.length > 0;

    return (
        <div className="table-container">
            <table className="table"> 
                <thead>
                    <tr>
                        {config.headers.map(column => (
                            <th
                                key={column.key}
                                onClick={() => handleOrder(column.key)}
                                style={column.ordinable ? { cursor: 'pointer' } : {}}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
                                        placeholder={`Filtra...`}
                                        className="filter-input"
                                        style={{ marginTop: '5px', width: 'calc(100% - 10px)' }} 
                                    />
                                )}
                            </th>
                        ))}
                        {hasActions && <th>Azioni</th>}
                    </tr>
                </thead>

                <tbody>
                    {paginatedData.length === 0 ? (
                         <tr>
                             <td colSpan={hasActions ? config.headers.length + 1 : config.headers.length} style={{ textAlign: 'center' }}>
                                 Nessun dato trovato.
                             </td>
                         </tr>
                    ) : (
                        paginatedData.map((row, rowIndex) => (
                            <tr key={row.id || rowIndex}>
                                {config.headers.map(column => (
                                    <td key={column.key}>
                                        {renderCellValue(row, column)}
                                    </td>
                                ))}

                                {hasActions && (
                                    <td>
                                        {config.actions.actions
                                            .filter(action => typeof action.visible !== 'function' || action.visible(row))
                                            .map((action, actionIndex) => (
                                                <button
                                                    key={action.name || actionIndex}
                                                    onClick={() => onActionClick && onActionClick({ action: action.name, row: row })}
                                                >
                                                    {action.name}
                                                </button>
                                            ))
                                        }
                                    </td>
                                )}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        onClick={() => changePage(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Precedente
                    </button>

                    {getPageNumbers().map((page, index) => (
                        page === '...' ? (
                            <span key={`dots-${index}`} style={{ padding: '5px 10px' }}>...</span>
                        ) : (
                        <span
                            key={page}
                            onClick={() => changePage(page)}
                            className={page === currentPage ? 'active' : ''}
                            style={{ cursor: 'pointer' }}
                        >
                            {page}
                        </span>
                        )
                    ))}

                    <button
                        onClick={() => changePage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Successivo
                    </button>
                </div>
            )}
        </div>
    );
}