export interface TableConfig<T = any> {
    headers: ColumnConfig[];
    currentByDefault?: OrderBy;
    pagination: PaginationConfig;
    actions?: ActionsConfig<T>;
};

export interface ColumnConfig {
    key: string;
    columnName: string;
    type: 'String' | 'Number' | 'Date';
    ordinable?: boolean;
    filtrable?: boolean;
}

export interface OrderBy {
    key: string;
    orderby: 'asc' | 'desc';
}

export interface PaginationConfig {
    itemsPerPage: number;
    currentPage: number;
}

export interface ActionsConfig<T> {
    actions: {
        name: string;
        visible?: (row: T) => boolean;
        onClick: (row: T) => void;
    }[];
}