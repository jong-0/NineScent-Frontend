// src/stores/authStore.js
import { defineStore } from 'pinia';
import axios from 'axios';
import { loginUser, logoutUser } from '@/api/memberApi';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: null,
        userId: null,
        userNo: null,
        userName: null,
        email: null,
        role: null,
        isAuthenticated: false,
    }),
    actions: {
        async login(username, password) {
            try {
                const response = await loginUser({
                    userId: username,
                    password,
                });

                if (!response || !response.data) {
                    throw new Error('로그인 응답 데이터가 없음');
                }

                const { token, userId, userNo, name, email, role } = response.data;

                this.token = token;
                this.userId = userId;
                this.userNo = userNo;
                this.userName = name;
                this.email = email;
                this.role = role;
                this.isAuthenticated = true;

                localStorage.setItem('token', token);
                localStorage.setItem('userId', userId);
                localStorage.setItem('userNo', userNo);
                localStorage.setItem('userName', name);
                localStorage.setItem('email', email);
                localStorage.setItem('role', role);

                return true;
            } catch (error) {
                console.error('로그인 실패:', error);
                return false;
            }
        },

        async logout() {
            try {
                await logoutUser();

                this.token = null;
                this.userId = null;
                this.userNo = null;
                this.userName = null;
                this.email = null;
                this.role = null;
                this.isAuthenticated = false;

                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                localStorage.removeItem('userNo');
                localStorage.removeItem('userName');
                localStorage.removeItem('email');
                localStorage.removeItem('role');
            } catch (error) {
                console.error('로그아웃 실패:', error);
            }
        },

        loadStoredToken() {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');
            const userNo = localStorage.getItem('userNo');
            const userName = localStorage.getItem('userName');
            const email = localStorage.getItem('email'); //   email 가져오기
            const role = localStorage.getItem('role');

            if (token && userId && userNo && userName && email) {
                //   email도 확인
                this.token = token;
                this.userId = userId;
                this.userNo = userNo;
                this.userName = userName;
                this.email = email; //   email 저장
                this.role = role;
                this.isAuthenticated = true;
            }
        },
    },
});
