import React from "react";
import styled from "styled-components";
import { FiSearch } from "react-icons/fi";

// 공통 스타일
const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const BaseInput = styled.input`
  background: #f8f9fa;
  border: none;
  border-radius: 12px;
  padding: 16px;
  font-size: 16px;
  color: #333;
  
  &::placeholder {
    color: #9ca3af;
  }
  
  &:focus {
    outline: none;
    background: #f3f4f6;
  }
`;

const BaseTextArea = styled.textarea`
    background: #f8f9fa;
    border: none;
    border-radius: 12px;
    padding: 16px;
    font-size: 16px;
    color: #333;
    min-height: 120px;
    resize: vertical;
    font-family: inherit;

    &::placeholder {
        color: #9ca3af;
    }

    &:focus {
        outline: none;
        background: #f3f4f6;
    }
`;

const SearchInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: 16px;
  color: #9ca3af;
  font-size: 18px;
`;

const SearchInput = styled(BaseInput)`
  padding-left: 48px;
`;

// 텍스트 입력 컴포넌트
export const TextInput = ({ title, value, onChange, placeholder, ...props }) => (
    <FormSection>
        <SectionTitle>{title}</SectionTitle>
        <BaseInput
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            {...props}
        />
    </FormSection>
);

// 텍스트 영역 컴포넌트
export const TextAreaInput = ({ title, value, onChange, placeholder, ...props }) => (
    <FormSection>
        <SectionTitle>{title}</SectionTitle>
        <BaseTextArea
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            {...props}
        />
    </FormSection>
);

// 검색 입력 컴포넌트
export const SearchTextInput = ({ title, value, onChange, placeholder, ...props }) => (
    <FormSection>
        <SectionTitle>{title}</SectionTitle>
        <SearchInputWrapper>
            <SearchIcon />
            <SearchInput
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                {...props}
            />
        </SearchInputWrapper>
    </FormSection>
);