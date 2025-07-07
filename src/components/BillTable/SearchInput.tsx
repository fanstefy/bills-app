import { useState, useMemo, useRef, useEffect } from 'react';
import { TextField, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import debounce from 'lodash/debounce';

interface SearchInputProps {
  onSearch: (query: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ onSearch }) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const debouncedSearch = useMemo(() => {
    return debounce((value: string) => {
      onSearch(value);
    }, 600);
  }, [onSearch]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
    debouncedSearch(value);
  };

  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        backgroundColor: 'white',
        zIndex: 1,
        p: 1,
        display: 'flex',
        justifyContent: 'center',
        borderRadius: '100px',
      }}
    >
      <TextField
        inputRef={inputRef}
        label="Search By Bill Type / No"
        variant="outlined"
        value={inputValue}
        onChange={handleChange}
        sx={{
          width: '300px',
          '& .MuiOutlinedInput-root': {
            borderRadius: '100px',
          },
        }}
        InputProps={{
          endAdornment: <SearchIcon sx={{ color: '#888' }} />,
        }}
      />
    </Box>
  );
};

export default SearchInput;
