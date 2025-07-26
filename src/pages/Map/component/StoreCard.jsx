import React from "react";
import styled from "styled-components";

const CardContainer = styled.div`
  padding: 12px;
  border: 1px solid ${(props) => (props.isSelected ? "#80c7bc" : "#e5e7eb")};
  border-radius: 12px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background: ${(props) => (props.isSelected ? "#f0fdf9" : "#fff")};

  &:hover {
    border-color: #80c7bc;
    background: #f0fdf9;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const StoreName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
`;

const StoreCategory = styled.div`
  font-size: 12px;
  color: #80c7bc;
  background: #f0fdf9;
  padding: 2px 8px;
  border-radius: 12px;
  display: inline-block;
  margin-bottom: 4px;
`;

const StoreAddress = styled.div`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 4px;
`;

const StorePhone = styled.div`
  font-size: 14px;
  color: #9ca3af;
`;

const StoreCard = React.memo(({ store, isSelected, onClick }) => {
  return (
    <CardContainer isSelected={isSelected} onClick={onClick}>
      <StoreCategory>{store.category}</StoreCategory>
      <StoreName>{store.name}</StoreName>
      <StoreAddress>{store.address}</StoreAddress>
      {store.phoneNumber && <StorePhone>{store.phoneNumber}</StorePhone>}
    </CardContainer>
  );
});

export default StoreCard;
