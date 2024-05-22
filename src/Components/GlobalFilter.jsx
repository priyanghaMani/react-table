
import { makeStyles } from '@mui/styles';
const useStyles = makeStyles(() => ({
    inputStyle: {
        margin: '16px',
        padding: '8px',
        fontSize: '16px',
        border: '1px solid #ccc',
        borderRadius: '4px',
    },

}));
const GlobalFilter = ({ globalFilter, setGlobalFilter }) => {
    const classes = useStyles();
    return (
        <input
            value={globalFilter || ''}
            onChange={(e) => setGlobalFilter(e.target.value || undefined)}
            placeholder="Search all columns..."
            className={classes.inputStyle}
        />
    );
};

export default GlobalFilter;
