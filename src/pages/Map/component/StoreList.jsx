import React from "react";
import styled from "styled-components";
import StoreCard from "./StoreCard";

const ListContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  border-radius: 16px 16px 0 0;
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.1);
  max-height: 40vh;
  z-index: 20;
  transition: transform 0.3s ease;
`;

const DragHandle = styled.div`
  width: 36px;
  height: 4px;
  background: #d1d5db;
  border-radius: 2px;
  margin: 12px auto 16px;
`;

const ListContent = styled.div`
  padding: 0 16px 16px;
  max-height: calc(40vh - 44px);
  overflow-y: auto;
`;

const LoadingText = styled.div`
  text-align: center;
  padding: 20px;
  color: #6b7280;
`;

const EmptyText = styled.div`
  text-align: center;
  padding: 20px;
  color: #9ca3af;
`;

const StoreList = React.memo(
  ({
    stores,
    selectedStore,
    onStoreSelect,
    isLoading,
    searchQuery,
    isSearchMode,
  }) => {
    // stores가 배열이 아닌 경우 빈 배열로 처리
    const safeStores = Array.isArray(stores) ? stores : [];

    if (isLoading) {
      return (
        <ListContainer>
          <DragHandle />
          <LoadingText>
            {isSearchMode ? "검색 중..." : "가맹점을 불러오는 중..."}
          </LoadingText>
        </ListContainer>
      );
    }

    if (!safeStores || safeStores.length === 0) {
      return (
        <ListContainer>
          <DragHandle />
          <EmptyText>
            {isSearchMode && searchQuery
              ? `"${searchQuery}"에 대한 검색 결과가 없습니다.`
              : "검색 결과가 없습니다."}
          </EmptyText>
        </ListContainer>
      );
    }

    return (
      <ListContainer>
        <DragHandle />
        <ListContent>
          {safeStores.map((store) => (
            <StoreCard
              key={store.id}
              store={store}
              isSelected={selectedStore?.id === store.id}
              onClick={() => onStoreSelect(store)}
            />
          ))}
        </ListContent>
      </ListContainer>
    );
  }
);

export default StoreList;
