import React from "react";
import styled from "styled-components";
import { FiSearch } from "react-icons/fi";

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px 12px 44px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 16px;
  background: #f9fafb;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #80c7bc;
    background: #fff;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: 14px;
  color: #9ca3af;
  font-size: 18px;
  pointer-events: none;
`;

const SearchBar = React.memo(({ value, onChange, placeholder }) => {
  return (
    <SearchContainer>
      <SearchIcon />
      <SearchInput
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </SearchContainer>
  );
});

export default SearchBar;
