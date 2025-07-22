// FormInput.jsx
import React from "react";
import styled from "styled-components";
import { FiSearch } from "react-icons/fi";

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

const CharCounter = styled.div`
  text-align: right;
  font-size: 14px;
  color: #9ca3af;
  margin-top: 4px;
`;

const ErrorText = styled.span`
  color: #ef4444;
  font-size: 12px;
  margin-top: 4px;
`;

export const TextInput = ({
                              title,
                              value,
                              onChange,
                              placeholder,
                              maxLength,
                              showCounter = false,
                              error,
                              ...props
                          }) => (
    <FormSection>
        <SectionTitle>{title}</SectionTitle>
        <BaseInput
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            maxLength={maxLength}
            {...props}
        />
        {showCounter && maxLength && (
            <CharCounter>{value?.length || 0}/{maxLength}</CharCounter>
        )}
        {error && <ErrorText>{error}</ErrorText>}
    </FormSection>
);

export const TextAreaInput = ({
                                  title,
                                  value,
                                  onChange,
                                  placeholder,
                                  maxLength,
                                  showCounter = false,
                                  error,
                                  ...props
                              }) => (
    <FormSection>
        <SectionTitle>{title}</SectionTitle>
        <BaseTextArea
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            maxLength={maxLength}
            {...props}
        />
        {showCounter && maxLength && (
            <CharCounter>{value?.length || 0}/{maxLength}</CharCounter>
        )}
        {error && <ErrorText>{error}</ErrorText>}
    </FormSection>
);

export const SearchTextInput = ({
                                    title,
                                    value,
                                    onChange,
                                    placeholder,
                                    maxLength,
                                    showCounter = false,
                                    error,
                                    ...props
                                }) => (
    <FormSection>
        <SectionTitle>{title}</SectionTitle>
        <SearchInputWrapper>
            <SearchIcon />
            <SearchInput
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                maxLength={maxLength}
                {...props}
            />
        </SearchInputWrapper>
        {showCounter && maxLength && (
            <CharCounter>{value?.length || 0}/{maxLength}</CharCounter>
        )}
        {error && <ErrorText>{error}</ErrorText>}
    </FormSection>
);