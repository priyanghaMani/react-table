import { useState, useMemo, useEffect } from 'react';
import FilterListIcon from '@mui/icons-material/FilterList';
import { makeStyles } from '@mui/styles';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';

const useStyles = makeStyles(() => ({
    filterContainer: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        width: '100%',
    },
    inputContainer: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
    },
    inputField: {
        flexGrow: 1,
    },
    hidden: {
        display: 'none',
    },
    listStyle: {
        height: '300px',
        overflowY: 'auto',
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
    divStyle: {
        padding: '10px'
    },
    buttonStyle: {
        display: 'inline-block',
        paddingRight: '8px'
    }
}));

const DefaultColumnFilter = ({
    column, onSearch
}) => {
    const classes = useStyles();
    const {
        filterValue = [],
        setFilter,
        Header,
        preFilteredRows,
        id
    } = column || {};
    const [anchorEl, setAnchorEl] = useState(null);
    const [disabledCheckboxes, setDisabledCheckboxes] = useState([]);
    const [selectedValue, setSelectedValue] = useState([]);
    const [filterList, setFilterList] = useState([]); //newly added
    const uniqueValues = useMemo(() => {
        const values = new Set();
        preFilteredRows.forEach(row => {
            values.add(row.values[id]);
        });
        return [...values];
    }, [preFilteredRows, id]);

    useEffect(() => {
        setFilterList(uniqueValues);
    }, [uniqueValues]);


    const handleIconClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleCheckboxChange = (value) => {
        let newSelectedValue;
        if (selectedValue.includes(value)) {
            newSelectedValue = selectedValue.filter(v => v !== value);
            setDisabledCheckboxes([]);
        } else {
            newSelectedValue = [value];
            setDisabledCheckboxes(uniqueValues.filter(v => v !== value));
        }
        setSelectedValue(newSelectedValue);
    };

    const handleSearchClick = () => {
        onSearch(id, selectedValue);
        setAnchorEl(null);
    };

    const handleResetClick = () => {
        setSelectedValue([]);
        setDisabledCheckboxes([]);
        onSearch(id, []);
        setAnchorEl(null);

    };

    return (
        <div className={classes.filterContainer}>
            <div className={classes.inputContainer}>
                <IconButton onClick={handleIconClick} size="small" color={selectedValue.length > 0 ? 'primary' : 'default'}>
                    <FilterListIcon />
                </IconButton>
            </div>
            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                sx={{
                    '& .MuiPaper-root': {
                        top: '118px'
                    }
                }}
            >
                <div className={classes.divStyle}>
                    <List className={classes.listStyle}>
                        {filterList.map((value, index) => (
                            <ListItem key={`${value}${index}`}>
                                <Checkbox
                                    label={value}
                                    checked={selectedValue.includes(value)}
                                    onChange={() => handleCheckboxChange(value)}
                                    disabled={disabledCheckboxes.includes(value)}
                                />
                                {value}
                            </ListItem>
                        ))}
                    </List>

                    <span className={classes.buttonStyle}><Button
                        variant="contained"
                        color="primary"
                        onClick={handleSearchClick}
                        disabled={!selectedValue.length}
                    >
                        Search
                    </Button></span>
                    <span><Button variant="contained" color="inherit" onClick={handleResetClick}>Reset</Button></span>

                </div>
            </Popover>
        </div>
    );
};
export default DefaultColumnFilter;