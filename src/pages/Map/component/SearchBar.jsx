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
  cursor: pointer;
`;

const SearchButton = styled.button`
  position: absolute;
  right: 8px;
  background: #80c7bc;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #6bb3a8;
  }

  &:active {
    background: #5a9a8f;
  }
`;

const SearchBar = React.memo(({ value, onChange, onSubmit, placeholder }) => {
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      onSubmit(value);
    }
  };

  const handleSearchClick = () => {
    onSubmit(value);
  };

  return (
    <SearchContainer>
      <SearchIcon onClick={handleSearchClick} />
      <SearchInput
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
      />
      <SearchButton onClick={handleSearchClick}>검색</SearchButton>
    </SearchContainer>
  );
});

export default SearchBar;
