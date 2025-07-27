import { create } from "zustand";

// UI 스토어 상태 타입
export const UIState = {
  // 모달 상태들
  modals: {
    meetingDetail: false,
    locationSearch: false,
    actionMenu: false,
  },

  // 메뉴 상태
  menus: {
    floatingAction: false,
  },

  // 탭 상태들
  tabs: {
    coupon: "exchange", // 'exchange' | 'my-coupons'
  },

  // 로딩 상태들
  loading: {
    global: false,
    auth: false,
    stores: false,
    meetings: false,
    points: false,
  },

  // 알림 상태
  notifications: [],

  // 포인트 관련 상태
  points: {
    currentPoints: 0,
    isLoading: false,
    lastUpdated: null,
  },
};

// Zustand UI 스토어 생성
export const useUIStore = create((set, get) => ({
  // 초기 상태
  ...UIState,

  // 모달 관리
  openModal: (modalName) => {
    set((state) => ({
      modals: {
        ...state.modals,
        [modalName]: true,
      },
    }));
  },

  closeModal: (modalName) => {
    set((state) => ({
      modals: {
        ...state.modals,
        [modalName]: false,
      },
    }));
  },

  // 메뉴 관리
  toggleMenu: (menuName) => {
    set((state) => ({
      menus: {
        ...state.menus,
        [menuName]: !state.menus[menuName],
      },
    }));
  },

  closeMenu: (menuName) => {
    set((state) => ({
      menus: {
        ...state.menus,
        [menuName]: false,
      },
    }));
  },

  // 탭 관리
  setTab: (tabName, value) => {
    set((state) => ({
      tabs: {
        ...state.tabs,
        [tabName]: value,
      },
    }));
  },

  // 로딩 상태 관리
  setLoading: (loadingName, isLoading) => {
    set((state) => ({
      loading: {
        ...state.loading,
        [loadingName]: isLoading,
      },
    }));
  },

  // 포인트 관리
  setPoints: (points) => {
    set((state) => ({
      points: {
        ...state.points,
        currentPoints: points,
        lastUpdated: new Date().toISOString(),
      },
    }));
  },

  setPointsLoading: (isLoading) => {
    set((state) => ({
      points: {
        ...state.points,
        isLoading,
      },
    }));
  },

  // 포인트 새로고침 함수 (안전한 방식)
  refreshPoints: () => {
    // 단순히 더미 함수로 만들어서 에러 방지
    console.log("refreshPoints 호출됨 - 현재는 비활성화");
  },

  // 알림 관리
  addNotification: (notification) => {
    const id = Date.now();
    const newNotification = { id, ...notification };

    set((state) => ({
      notifications: [...state.notifications, newNotification],
    }));

    // 자동 제거 (5초 후)
    setTimeout(() => {
      get().removeNotification(id);
    }, 5000);
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  // 모든 모달 닫기
  closeAllModals: () => {
    set((state) => ({
      modals: Object.keys(state.modals).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {}),
    }));
  },
}));

// 편의 함수들
export const getModalState = (modalName) =>
    useUIStore.getState().modals[modalName];
export const getMenuState = (menuName) => useUIStore.getState().menus[menuName];
export const getTabState = (tabName) => useUIStore.getState().tabs[tabName];
export const getLoadingState = (loadingName) =>
    useUIStore.getState().loading[loadingName];
export const getPointsState = () => useUIStore.getState().points;