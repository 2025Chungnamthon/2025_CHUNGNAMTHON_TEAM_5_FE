import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FiArrowLeft } from "react-icons/fi";
import { useParams, useNavigate } from "react-router-dom";

const MOBILE_MAX_WIDTH = 430;

const PageContainer = styled.div`
    max-width: ${MOBILE_MAX_WIDTH}px;
    margin: 0 auto;
    background: #fff;
    min-height: 100vh;
    padding: 0;
`;

const Header = styled.div`
    background: #fff;
    padding: 16px 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    position: sticky;
    top: 0;
    z-index: 10;
`;

const BackButton = styled.button`
    background: none;
    border: none;
    padding: 8px;
    cursor: pointer;
    color: #333;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s;

    svg {
        font-size: 20px;
    }

    &:hover {
        color: #80c7bc;
    }
`;

const HeaderTitle = styled.h1`
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin: 0;
`;

const Content = styled.div`
    padding: 0 20px 100px 20px;
    display: flex;
    flex-direction: column;
    gap: 32px;
`;

const SectionContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const SectionHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const SectionTitle = styled.h3`
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin: 0;
`;

const CountBadge = styled.span`
    background: #fff;
    color: #80c7bc;
    font-size: 14px;
    font-weight: 600;
    padding: 4px 5px;
    border-radius: 12px;
    min-width: 15px;
    text-align: center;
`;

const MemberList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0;
`;

const MemberItem = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 0;
    border-bottom: 1px solid #f3f4f6;

    &:last-child {
        border-bottom: none;
    }
`;

const MemberNumber = styled.div`
    font-size: 16px;
    font-weight: 600;
    color: #666;
    min-width: 20px;
`;

const MemberAvatar = styled.img`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    background: #f3f4f6;
    flex-shrink: 0;
`;

const MemberName = styled.div`
    font-size: 16px;
    font-weight: 500;
    color: #333;
    flex: 1;
`;

const MemberStatus = styled.span`
    font-size: 14px;
    font-weight: 500;
    color: #666;
    background: #f3f4f6;
    padding: 6px 12px;
    border-radius: 12px;
`;

const ActionButtons = styled.div`
    display: flex;
    gap: 8px;
`;

const ActionButton = styled.button`
    background: ${(props) => {
        if (props.variant === 'approve') return '#F2F4F4';
        if (props.variant === 'reject') return '#F66570';
        return '#F66570';
    }};
    color: ${(props) => {
        if (props.variant === 'approve') return '#000';
        if (props.variant === 'reject') return '#fff';
        return '#000';
    }};
    border: none;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 600;
    padding: 10px 16px;
    cursor: pointer;
    transition: all 0.2s;
    min-width: 60px;

    &:hover {
        background: ${(props) => {
            if (props.variant === 'approve') return '#e5e7eb';
            if (props.variant === 'reject') return '#dc2626';
            return '#dc2626';
        }};
    }

    &:active {
        transform: scale(0.98);
    }
`;

const BottomButton = styled.button`
    background: ${props => props.disabled ? '#d1d5db' : '#80c7bc'};
    color: #fff;
    border: none;
    border-radius: 12px;
    padding: 16px;
    font-size: 16px;
    font-weight: 600;
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    width: 100%;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 24px;

    &:hover {
        background: #5fa89e;
        transform: translateY(-2px);
    }
`;

const EmptyContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 40px 20px;
    color: #6b7280;
    font-size: 14px;
    text-align: center;
`;

// 더미 데이터
const DUMMY_MEMBERS = {
    approved: [
        {
            memberId: 1,
            name: "김천안",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b332e234?w=150&h=150&fit=crop&crop=face",
            status: "승인"
        },
        {
            memberId: 2,
            name: "김천안",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
            status: "승인"
        }
    ],
    pending: [
        {
            memberId: 3,
            name: "김천안",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
        },
        {
            memberId: 4,
            name: "김천안",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
        },
        {
            memberId: 5,
            name: "김천안",
            avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
        },
        {
            memberId: 6,
            name: "김천안",
            avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face"
        }
    ]
};

const MemberManagementPage = () => {
    const { meetingId } = useParams();
    const navigate = useNavigate();

    const [members, setMembers] = useState(DUMMY_MEMBERS);

    useEffect(() => {
        // 실제로는 API 호출을 통해 멤버 데이터를 가져옴
        console.log(`모임 ${meetingId}의 멤버 데이터 로드`);
    }, [meetingId]);

    const handleBack = () => {
        navigate(-1);
    };

    const handleImageError = (e) => {
        e.target.src = "https://images.unsplash.com/photo-1494790108755-2616b332e234?w=150&h=150&fit=crop&crop=face";
    };

    const handleApprove = async (memberId) => {
        try {
            console.log(`멤버 ${memberId} 승인`);

            // 승인 처리 로직
            const memberToApprove = members.pending.find(m => m.memberId === memberId);
            if (memberToApprove) {
                setMembers(prev => ({
                    approved: [...prev.approved, { ...memberToApprove, status: "승인" }],
                    pending: prev.pending.filter(m => m.memberId !== memberId)
                }));
            }

            alert("멤버를 승인했습니다.");
        } catch (err) {
            console.error("승인 실패:", err);
            alert("승인에 실패했습니다.");
        }
    };

    const handleReject = async (memberId) => {
        try {
            console.log(`멤버 ${memberId} 거절`);

            if (window.confirm("정말로 이 멤버를 거절하시겠습니까?")) {
                // 거절 처리 로직
                setMembers(prev => ({
                    ...prev,
                    pending: prev.pending.filter(m => m.memberId !== memberId)
                }));

                alert("멤버를 거절했습니다.");
            }
        } catch (err) {
            console.error("거절 실패:", err);
            alert("거절에 실패했습니다.");
        }
    };

    const handleKick = async (memberId) => {
        try {
            console.log(`멤버 ${memberId} 내보내기`);

            if (window.confirm("정말로 이 멤버를 내보내시겠습니까?")) {
                // 내보내기 처리 로직
                setMembers(prev => ({
                    ...prev,
                    approved: prev.approved.filter(m => m.memberId !== memberId)
                }));

                alert("멤버를 내보냈습니다.");
            }
        } catch (err) {
            console.error("내보내기 실패:", err);
            alert("내보내기에 실패했습니다.");
        }
    };

    const handleSave = () => {
        console.log("변경사항 저장");
        alert("변경사항이 저장되었습니다.");
        navigate(-1);
    };

    return (
        <PageContainer>
            <Header>
                <BackButton onClick={handleBack}>
                    <FiArrowLeft />
                </BackButton>
                <HeaderTitle>멤버 관리하기</HeaderTitle>
            </Header>

            <Content>
                {/* 가입 요청 섹션 */}
                <SectionContainer>
                    <SectionHeader>
                        <SectionTitle>가입 요청</SectionTitle>
                        <CountBadge>{members.pending.length}</CountBadge>
                    </SectionHeader>

                    {members.pending.length === 0 ? (
                        <EmptyContainer>
                            <div>가입 요청이 없습니다.</div>
                        </EmptyContainer>
                    ) : (
                        <MemberList>
                            {members.pending.map((member, index) => (
                                <MemberItem key={member.memberId}>
                                    <MemberNumber>{index + 1}</MemberNumber>
                                    <MemberAvatar
                                        src={member.avatar}
                                        alt={member.name}
                                        onError={handleImageError}
                                    />
                                    <MemberName>{member.name}</MemberName>
                                    <ActionButtons>
                                        <ActionButton
                                            variant="approve"
                                            onClick={() => handleApprove(member.memberId)}
                                        >
                                            승인
                                        </ActionButton>
                                        <ActionButton
                                            variant="reject"
                                            onClick={() => handleReject(member.memberId)}
                                        >
                                            거절
                                        </ActionButton>
                                    </ActionButtons>
                                </MemberItem>
                            ))}
                        </MemberList>
                    )}
                </SectionContainer>

                {/* 현재 참여중인 멤버 섹션 */}
                <SectionContainer>
                    <SectionHeader>
                        <SectionTitle>현재 참여중인 멤버</SectionTitle>
                        <CountBadge>{members.approved.length}</CountBadge>
                    </SectionHeader>

                    {members.approved.length === 0 ? (
                        <EmptyContainer>
                            <div>참여중인 멤버가 없습니다.</div>
                        </EmptyContainer>
                    ) : (
                        <MemberList>
                            {members.approved.map((member, index) => (
                                <MemberItem key={member.memberId}>
                                    <MemberNumber>{index + 1}</MemberNumber>
                                    <MemberAvatar
                                        src={member.avatar}
                                        alt={member.name}
                                        onError={handleImageError}
                                    />
                                    <MemberName>{member.name}</MemberName>
                                    <ActionButton
                                        variant="reject"
                                        onClick={() => handleKick(member.memberId)}
                                    >
                                        내보내기
                                    </ActionButton>
                                </MemberItem>
                            ))}
                        </MemberList>
                    )}
                </SectionContainer>
                <BottomButton onClick={handleSave}>
                    저장하기
                </BottomButton>
            </Content>

        </PageContainer>
    );
};

export default MemberManagementPage;