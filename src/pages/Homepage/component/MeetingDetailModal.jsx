import React from "react";
import styled from "styled-components";
import TagBadge from "../../../components/TagBadge";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContainer = styled.div`
  background: #fff;
  border-radius: 24px;
  width: 100%;
  max-width: 400px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 16px;
  padding: 20px 20px 16px 20px;
  border-bottom: 1px solid #f3f4f6;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 24px;
  color: #6b7280;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  &:hover {
    background: #f3f4f6;
  }
`;

const MeetingImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 16px;
  object-fit: cover;
  flex-shrink: 0;
`;

const InfoCol = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  min-width: 0;
  flex: 1;
`;

const AuthorName = styled.div`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 4px;
`;

const MeetingTitle = styled.h2`
  font-size: 18px;
  font-weight: 800;
  color: #111;
  margin-bottom: 4px;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TagContainer = styled.div`
  display: flex;
  gap: 0;
  margin-bottom: 0;
`;

const ModalBody = styled.div`
  padding: 20px;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #111;
  margin-bottom: 12px;
`;

const Description = styled.div`
  font-size: 14px;
  line-height: 1.6;
  color: #374151;
  margin-bottom: 16px;
  white-space: pre-line;
`;
const ActionButton = styled.button`
  width: 90%;
  background: #4ecdc4;
  color: #fff;
  border: none;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 600;
  padding: 16px;
  margin: 20px 20px 20px 20px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #3bb5ad;
  }
`;

const MeetingDetailModal = ({ isOpen, onClose, meetingData }) => {
  if (!isOpen || !meetingData) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContainer>
        <CloseButton onClick={onClose}>×</CloseButton>
        <ModalHeader>
          <MeetingImage src={meetingData.image} alt={meetingData.title} />
          <InfoCol>
            <AuthorName>@{meetingData.author}</AuthorName>
            <MeetingTitle>{meetingData.title}</MeetingTitle>
            <TagContainer>
              {meetingData.tags?.map((tag, i) => (
                <TagBadge
                  key={i}
                  type={tag.type}
                  text={tag.text}
                  className={i === meetingData.tags.length - 1 ? "last" : ""}
                />
              ))}
            </TagContainer>
          </InfoCol>
        </ModalHeader>
        <ModalBody>
          <SectionTitle>소개글</SectionTitle>
          <Description>{meetingData.fullDescription}</Description>
        </ModalBody>
        <ActionButton>오픈채팅 참가하기</ActionButton>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default MeetingDetailModal;
