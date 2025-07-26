import React, { useState, useEffect, useCallback, useMemo } from "react";
import styled from "styled-components";
import { FiArrowLeft } from "react-icons/fi";
import { useParams, useNavigate } from "react-router-dom";
import { meetingApi } from "../../services/meetingApi";

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

const MemberAvatar = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: ${props => props.bgColor || '#e5e7eb'};
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-weight: 600;
    font-size: 14px;
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

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
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
        background: ${props => props.disabled ? '#d1d5db' : '#5fa89e'};
        transform: ${props => props.disabled ? 'none' : 'translateY(-2px)'};
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

const LoadingContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 60px 20px;
    color: #6b7280;
    font-size: 14px;
`;

const ErrorContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 60px 20px;
    color: #ef4444;
    font-size: 14px;
    text-align: center;
`;

const RetryButton = styled.button`
    background: #80c7bc;
    color: #fff;
    border: none;
    border-radius: 12px;
    padding: 12px 24px;
    font-size: 14px;
    font-weight: 600;
    margin-top: 16px;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
        background: #5fa89e;
    }
`;

// 아바타 색상 생성 함수
const generateAvatarColor = (userId) => {
    const colors = [
        '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
        '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'
    ];
    return colors[userId % colors.length];
};

const MemberManagementPage = () => {
    const { meetingId } = useParams();
    const navigate = useNavigate();

    // 상태 관리
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(null);

    // 멤버 리스트를 status에 따라 분류
    const { pendingMembers, approvedMembers } = useMemo(() => {
        const pending = members.filter(member => member.status === 'REQUESTED');
        const approved = members.filter(member => member.status === 'PARTICIPATING');

        return {
            pendingMembers: pending,
            approvedMembers: approved
        };
    }, [members]);

    // 멤버 데이터 불러오기
    const fetchMembers = useCallback(async () => {
        if (!meetingId) return;

        try {
            setLoading(true);
            setError(null);
            console.log(`모임 ${meetingId}의 멤버 데이터 로드 시작`);

            const response = await meetingApi.getMeetingMembers(meetingId);

            if (response && response.data) {
                console.log('멤버 데이터:', response.data);
                setMembers(response.data);
            } else {
                console.warn('멤버 데이터가 없습니다.');
                setMembers([]);
            }
        } catch (err) {
            console.error('멤버 데이터 로드 실패:', err);
            setError(err.message || '멤버 정보를 불러오는데 실패했습니다.');
            setMembers([]);
        } finally {
            setLoading(false);
        }
    }, [meetingId]);

    // 컴포넌트 마운트 시 데이터 로드
    useEffect(() => {
        fetchMembers();
    }, [fetchMembers]);

    const handleBack = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    // 멤버 승인 처리
    const handleApprove = useCallback(async (userId) => {
        if (actionLoading === userId) return;

        try {
            setActionLoading(userId);
            console.log(`멤버 ${userId} 승인 시작`);

            await meetingApi.approveMember(meetingId, userId);

            alert("멤버를 승인했습니다.");

            // 멤버 리스트 새로고침
            await fetchMembers();
        } catch (err) {
            console.error("승인 실패:", err);
            alert(err.message || "승인에 실패했습니다.");
        } finally {
            setActionLoading(null);
        }
    }, [meetingId, fetchMembers, actionLoading]);

    // 멤버 거절 처리
    const handleReject = useCallback(async (userId) => {
        if (actionLoading === userId) return;

        const member = members.find(m => m.userId === userId);
        const memberName = member?.userNickName || `사용자 ${userId}`;

        if (window.confirm(`정말로 ${memberName}님의 가입 신청을 거절하시겠습니까?`)) {
            try {
                setActionLoading(userId);
                console.log(`멤버 ${userId} 거절 시작`);

                await meetingApi.rejectMember(meetingId, userId);

                alert("멤버를 거절했습니다.");

                // 멤버 리스트 새로고침
                await fetchMembers();
            } catch (err) {
                console.error("거절 실패:", err);
                alert(err.message || "거절에 실패했습니다.");
            } finally {
                setActionLoading(null);
            }
        }
    }, [meetingId, fetchMembers, actionLoading, members]);

    // 멤버 내보내기 (나중에 구현)
    const handleKick = useCallback(async (userId) => {
        const member = members.find(m => m.userId === userId);
        const memberName = member?.userNickName || `사용자 ${userId}`;

        alert(`${memberName}님 내보내기 기능은 준비 중입니다.`);
    }, [members]);

    // 저장하기 (현재는 닫기만)
    const handleSave = useCallback(() => {
        console.log("변경사항 저장");
        navigate(-1);
    }, [navigate]);

    // 재시도 핸들러
    const handleRetry = () => {
        fetchMembers();
    };

    // 메모이제이션된 아바타 컴포넌트
    const MemberAvatarComponent = useMemo(() => {
        return ({ userNickName, userId }) => (
            <MemberAvatar bgColor={generateAvatarColor(userId)}>
                {userNickName ? userNickName.charAt(0) : '?'}
            </MemberAvatar>
        );
    }, []);

    // 로딩 상태
    if (loading) {
        return (
            <PageContainer>
                <Header>
                    <BackButton onClick={handleBack}>
                        <FiArrowLeft />
                    </BackButton>
                    <HeaderTitle>멤버 관리하기</HeaderTitle>
                </Header>
                <LoadingContainer>
                    멤버 정보를 불러오는 중...
                </LoadingContainer>
            </PageContainer>
        );
    }

    // 에러 상태
    if (error) {
        return (
            <PageContainer>
                <Header>
                    <BackButton onClick={handleBack}>
                        <FiArrowLeft />
                    </BackButton>
                    <HeaderTitle>멤버 관리하기</HeaderTitle>
                </Header>
                <ErrorContainer>
                    <div>{error}</div>
                    <RetryButton onClick={handleRetry}>
                        다시 시도
                    </RetryButton>
                </ErrorContainer>
            </PageContainer>
        );
    }

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
                        <CountBadge>{pendingMembers.length}</CountBadge>
                    </SectionHeader>

                    {pendingMembers.length === 0 ? (
                        <EmptyContainer>
                            <div>가입 요청이 없습니다.</div>
                        </EmptyContainer>
                    ) : (
                        <MemberList>
                            {pendingMembers.map((member, index) => (
                                <MemberItem key={member.userId}>
                                    <MemberNumber>{index + 1}</MemberNumber>
                                    <MemberAvatarComponent
                                        userNickName={member.userNickName}
                                        userId={member.userId}
                                    />
                                    <MemberName>{member.userNickName}</MemberName>
                                    <ActionButtons>
                                        <ActionButton
                                            variant="approve"
                                            onClick={() => handleApprove(member.userId)}
                                            disabled={actionLoading === member.userId}
                                        >
                                            {actionLoading === member.userId ? '처리중' : '승인'}
                                        </ActionButton>
                                        <ActionButton
                                            variant="reject"
                                            onClick={() => handleReject(member.userId)}
                                            disabled={actionLoading === member.userId}
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
                        <CountBadge>{approvedMembers.length}</CountBadge>
                    </SectionHeader>

                    {approvedMembers.length === 0 ? (
                        <EmptyContainer>
                            <div>참여중인 멤버가 없습니다.</div>
                        </EmptyContainer>
                    ) : (
                        <MemberList>
                            {approvedMembers.map((member, index) => (
                                <MemberItem key={member.userId}>
                                    <MemberNumber>{index + 1}</MemberNumber>
                                    <MemberAvatarComponent
                                        userNickName={member.userNickName}
                                        userId={member.userId}
                                    />
                                    <MemberName>{member.userNickName}</MemberName>
                                    <ActionButton
                                        variant="reject"
                                        onClick={() => handleKick(member.userId)}
                                        disabled={actionLoading === member.userId}
                                    >
                                        {actionLoading === member.userId ? '처리중' : '내보내기'}
                                    </ActionButton>
                                </MemberItem>
                            ))}
                        </MemberList>
                    )}
                </SectionContainer>

                <BottomButton onClick={handleSave} disabled={actionLoading !== null}>
                    저장하기
                </BottomButton>
            </Content>
        </PageContainer>
    );
};

export default MemberManagementPage;