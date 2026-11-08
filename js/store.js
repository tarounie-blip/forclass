// js/store.js
const ClassStore = {
  KEYS: {
    TITLE: 'class_portal_title',
    ROSTER: 'class_portal_roster',
    TEACHER_PW: 'class_portal_teacher_pw',
    FEEDBACKS: 'class_portal_feedbacks', // { "1_김민준": "피드백 내용..." }
    CURRENT_STU: 'class_portal_current_student'
  },

  // 초기 로드 시 URL 파라미터(?sync=...)가 있으면 로컬 스토리지에 자동 동기화
  init() {
    const params = new URLSearchParams(window.location.search);
    const syncData = params.get('sync');
    if (syncData) {
      try {
        const parsed = JSON.parse(decodeURIComponent(escape(atob(syncData))));
        if (parsed.title) localStorage.setItem(this.KEYS.TITLE, parsed.title);
        if (parsed.roster) localStorage.setItem(this.KEYS.ROSTER, JSON.stringify(parsed.roster));
        if (parsed.feedbacks) localStorage.setItem(this.KEYS.FEEDBACKS, JSON.stringify(parsed.feedbacks));
      } catch (e) {
        console.error('동기화 데이터 파싱 오류:', e);
      }
    }
  },

  // 1. 누리집 제목 관리
  getTitle() {
    return localStorage.getItem(this.KEYS.TITLE) || '우리반 누리집';
  },
  setTitle(newTitle) {
    localStorage.setItem(this.KEYS.TITLE, newTitle.trim() || '우리반 누리집');
  },

  // 2. 교사 비밀번호 관리
  getTeacherPw() {
    return localStorage.getItem(this.KEYS.TEACHER_PW) || '1234';
  },
  setTeacherPw(newPw) {
    localStorage.setItem(this.KEYS.TEACHER_PW, newPw.trim());
  },

  // 3. 학생 명단 및 개별 비밀번호 관리
  getRoster() {
    const raw = localStorage.getItem(this.KEYS.ROSTER);
    return raw ? JSON.parse(raw) : [];
  },
  saveRoster(roster) {
    roster.sort((a, b) => a.num - b.num);
    localStorage.setItem(this.KEYS.ROSTER, JSON.stringify(roster));
  },
  generatePin() {
    return String(Math.floor(1000 + Math.random() * 9000));
  },

  // 4. 학생별 교사 피드백 관리
  getFeedbacks() {
    const raw = localStorage.getItem(this.KEYS.FEEDBACKS);
    return raw ? JSON.parse(raw) : {};
  },
  setFeedback(studentKey, message) {
    const all = this.getFeedbacks();
    if (message.trim()) all[studentKey] = message.trim();
    else delete all[studentKey];
    localStorage.setItem(this.KEYS.FEEDBACKS, JSON.stringify(all));
  },

  // 5. 현재 로그인한 학생 세션
  setCurrentStudent(stuObj) {
    sessionStorage.setItem(this.KEYS.CURRENT_STU, JSON.stringify(stuObj));
  },
  getCurrentStudent() {
    const raw = sessionStorage.getItem(this.KEYS.CURRENT_STU);
    return raw ? JSON.parse(raw) : null;
  },
  logoutStudent() {
    sessionStorage.removeItem(this.KEYS.CURRENT_STU);
  },

  // 6. 학생 배포용 동기화 URL 생성 (제목 + 명단/비번 + 개별 피드백 포함)
  generateShareUrl() {
    const payload = {
      title: this.getTitle(),
      roster: this.getRoster(),
      feedbacks: this.getFeedbacks()
    };
    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
    const basePath = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1);
    return `${basePath}index.html?sync=${encoded}`;
  }
};

ClassStore.init();