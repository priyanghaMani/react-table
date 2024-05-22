import { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import {
    useTable,
    useFilters,
    useSortBy,
    useResizeColumns,
    useFlexLayout, useGlobalFilter
} from 'react-table';
import Popover from '@mui/material/Popover';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { makeStyles } from '@mui/styles';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import DefaultColumnFilter from './DefaultColumnFilter.jsx';
import GlobalFilter from './GlobalFilter.jsx';

const useStyles = makeStyles(() => ({
    tableContainer: {
        margin: '16px',
    },
    tableBody: {
        height: '420px',
        overflowY: 'auto',
        overflowX: 'hidden',
        paddingRight: '4px',
        '&::-webkit-scrollbar': {
            width: '4px',
            height: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
            background: '#555',
        },
        '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
        },
    },
    table: {
        width: 'calc(100% - 2px)',
        border: 0,
        borderCollapse: 'collapse'
    },
    th: {
        position: 'sticky',
        top: 0,
        backgroundColor: 'white',
        zIndex: 1,
        display: 'flex',
        alignItems: 'center',
        height: '40px',
    },
    thTr: {
        borderBottom: '1px solid #DDE3EE',
        borderTop: '1px solid #DDE3EE',
        paddingRight: '5px',
    },
    tr: {
        height: '60px',
        '&:hover': {
            backgroundColor: '#F7F9FC'
        },
    },
    td: {
        borderRight: '1px solid #DDE3EE'
    },
    buttonSytle: {
        fontSize: '16px'
    },
    popoverStyle: {
        display: 'flex',
        flexDirection: 'column'
    },
}));

const PAGE_SIZE = 10;

const CustomTable = () => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
    const [currentRowIndex, setCurrentRowIndex] = useState(-1);
    const [page, setPage] = useState(1);
    const [isFetching, setIsFetching] = useState(false);
    const [data, setData] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [filterValue, setFilterValue] = useState({});
    const observer = useRef();

    const fetchData = async (pageNumber, pageSize) => {
        setIsFetching(true);
        const newData = await getData(pageNumber, pageSize);
        if (pageNumber === 1) {
            setData(newData);
        } else {
            setData(prevData => [...prevData, ...newData]);
        }
        setIsFetching(false);
    };

    const getData = async (pageNumber, pageSize) => {
        const response = await fetch('data.json');
        const allData = await response.json();
        setTotalRecords(allData.length);
        const startIndex = (pageNumber - 1) * pageSize;
        const endIndex = Math.min(startIndex + pageSize, allData.length); // Ensure endIndex does not exceed total records
        return allData.slice(startIndex, endIndex);
    };

    const loadMoreData = useCallback(() => {
        if (!isFetching && (data.length < totalRecords)) {
            setPage(prevPage => prevPage + 1);
        }
    }, [isFetching, data.length, totalRecords]);

    useEffect(() => {
        fetchData(page, PAGE_SIZE);
    }, [page]);

    const lastRowRef = useCallback(node => {
        if (isFetching) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && !isFetching) {
                loadMoreData();
            }
        });
        if (node) observer.current.observe(node);
    }, [isFetching, loadMoreData]);


    const handlePopoverOpen = (event, rowIndex) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setAnchorEl(event.currentTarget);
        setPopoverPosition({ top: rect.top + rect.height, left: rect.left - 5 });
        setCurrentRowIndex(rowIndex);
    };

    const handlePopoverClose = () => {
        if (setAnchorEl !== null) {
            setAnchorEl(null);
            setCurrentRowIndex(-1);
        }
    };
    const open = Boolean(anchorEl);
    const generateCellRenderer = (value, type) => (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: type === 'number' ? 'flex-end' : type === 'string' ? 'flex-start' : 'center',
                height: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
            }}
        >
            {value}
        </div>
    );

    const defaultColumn = useMemo(
        () => ({
            Filter: DefaultColumnFilter,
            minWidth: 30,
            width: 150,
            maxWidth: 400,
        }),
        []
    );
    const numericSort = (rowA, rowB, columnId, desc) => {
        const a = rowA.values[columnId];
        const b = rowB.values[columnId];
        return a === b ? 0 : a > b ? 1 : -1;
    };
    const Columns = useMemo(
        () => [
            {
                Header: 'Title',
                accessor: 'title',
                Filter: DefaultColumnFilter,
                filter: 'includes',
                Cell: ({ cell: { value } }) => generateCellRenderer(value, typeof value),
                sortType: 'alphanumeric',
                minWidth: 100,
                maxWidth: 300,
            },
            {
                Header: 'Language',
                accessor: 'language',
                Filter: DefaultColumnFilter,
                filter: 'includes',
                Cell: ({ cell: { value } }) => generateCellRenderer(value, typeof value),
                sortType: 'alphanumeric',
                minWidth: 150,
                maxWidth: 300,
            },
            {
                Header: 'Content Type',
                accessor: 'contentType',
                Filter: DefaultColumnFilter,
                filter: 'includes',
                Cell: ({ cell: { value } }) => generateCellRenderer(value, typeof value),
                sortType: 'alphanumeric',
                minWidth: 200,
                maxWidth: 500,
            },
            {
                Header: 'Version',
                accessor: 'version',
                Filter: DefaultColumnFilter,
                filter: 'numericFilterFn',
                Cell: ({ cell: { value } }) => generateCellRenderer(value, typeof value),
                sortType: numericSort,
                minWidth: 150,
                maxWidth: 300,
            },
            {
                Header: 'Publish stage',
                accessor: 'publishStage',
                Filter: DefaultColumnFilter,
                filter: 'includes',
                Cell: ({ cell: { value } }) => generateCellRenderer(value, typeof value),
                sortType: 'alphanumeric',
                minWidth: 200,
                maxWidth: 500,
            },
            {
                Header: 'Workflow stage',
                accessor: 'workflowStage',
                Filter: DefaultColumnFilter,
                filter: 'includes',
                Cell: ({ cell: { value } }) => generateCellRenderer(value, 'center'),
                sortType: 'alphanumeric',
                minWidth: 200,
                maxWidth: 500,
            },
            {
                Header: 'Tags',
                accessor: 'tags',
                Filter: DefaultColumnFilter,
                filter: 'includes',
                Cell: ({ cell: { value } }) => generateCellRenderer(value, typeof value),
                sortType: 'alphanumeric',
                minWidth: 100,
                maxWidth: 300,
            },
            {
                Header: 'Actions',
                Cell: ({ row, rowIndex }) => (
                    <div>
                        <IconButton onClick={(e) => handlePopoverOpen(e, rowIndex)}>
                            <MoreVertIcon style={{ width: '14px' }} />
                        </IconButton>
                        <Popover
                            open={open && currentRowIndex === rowIndex}
                            anchorReference="anchorPosition"
                            anchorPosition={popoverPosition}
                            onClose={handlePopoverClose}
                            sx={{
                                '& .MuiPaper-root': {
                                    boxShadow: 'none',
                                    border: '1px solid #ccc'
                                },
                            }}
                        >
                            <div className={classes.popoverStyle}>
                                <Button className={classes.buttonSytle}>Edit</Button>
                                <Button className={classes.buttonSytle}>Delete</Button>
                            </div>
                        </Popover>
                    </div>
                ),
                minWidth: 70,
                maxWidth: 70,
                disableFilter: true,
                disableResizing: true
            },
        ],
        [open, popoverPosition, currentRowIndex]
    );
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        setFilter,
        setGlobalFilter,
        state: { globalFilter },
    } = useTable(
        {
            columns: Columns,
            data,
            defaultColumn,
            initialState: {
                sortBy: [
                    {
                        id: 'title',
                        desc: false,
                    },
                ],
                filters: Object.entries(filterValue).map(([columnId, value]) => ({
                    id: columnId,
                    value: value
                }))
            }
        },
        useFilters,
        useGlobalFilter,
        useSortBy,
        useResizeColumns,
        useFlexLayout
    );

    const handleSearch = useCallback((columnId, filterValue) => {
        setFilter(columnId, filterValue);
        setFilterValue(prev => ({ ...prev, [columnId]: filterValue }));//newly added
    }, []);

    return (
        <>
            <GlobalFilter globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
            <div className={classes.tableContainer}>
                <div {...getTableProps()} className={`table ${classes.table}`}>
                    <div className={classes.tableHeader}>
                        {headerGroups.map((headerGroup, index) => (
                            <div
                                {...headerGroup.getHeaderGroupProps()}
                                className={`tr ${classes.thTr}`}
                                key={`header-${index}`}
                            >
                                {headerGroup.headers.map((column, colIndex) => (
                                    <div
                                        {...column.getHeaderProps()}
                                        className={`th ${classes.th}`}
                                        key={`header-${index}-${colIndex}`}
                                    >
                                        {column.render('Header')}
                                        {column.canSort && (
                                            <span {...column.getSortByToggleProps()}>
                                                {column.isSorted ? (
                                                    column.isSortedDesc ? (
                                                        <ArrowDownwardIcon style={{ cursor: 'pointer', paddingLeft: 8, width: 12, height: 12 }} />
                                                    ) : (
                                                        <ArrowUpwardIcon style={{ cursor: 'pointer', paddingLeft: 8, width: 12, height: 12 }} />
                                                    )
                                                ) : (
                                                    <>
                                                        <ArrowDownwardIcon style={{ cursor: 'pointer', opacity: 0.3, paddingLeft: 8, width: 12, height: 12 }} />
                                                        <ArrowUpwardIcon style={{ cursor: 'pointer', opacity: 0.3, width: 12, height: 12 }} />
                                                    </>
                                                )}
                                            </span>
                                        )}
                                        <div>
                                            {!column.disableFilter && (
                                                <div>
                                                    {column.canFilter ? <DefaultColumnFilter column={column} onSearch={handleSearch} /> : null}
                                                </div>
                                            )}
                                        </div>
                                        {!column.disableResizing && (<div {...column.getResizerProps()} className="resizer" />)}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                    {rows.length === 0 ? (<div className="empty-table">No data available</div>) : (
                        <div {...getTableBodyProps()} className={`tbody ${classes.tableBody}`}>
                            {rows.map((row, rowIndex) => {
                                prepareRow(row);
                                return (
                                    <div {...row.getRowProps()} className={`tr ${classes.tr}`} key={`row-${rowIndex}`} ref={rowIndex === rows.length - 1 ? lastRowRef : null}>
                                        {row.cells.map((cell, cellIndex) => (
                                            <div {...cell.getCellProps()} className={`td ${classes.td}`} key={`cell-${rowIndex}-${cellIndex}`}>
                                                {cell.render('Cell')}
                                            </div>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                </div>
            </div>
        </>);
};

export default CustomTable;
