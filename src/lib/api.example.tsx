// API使用示例

import React, { useEffect, useState } from 'react';
import { userApi, storyApi } from './api';

// 获取用户资料示例
const UserProfileExample: React.FC<{ userId: string }> = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await userApi.getUserProfile(userId);
        setUser(response.data);
        setLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.message || '获取用户资料失败');
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误: {error}</div>;

  return (
    <div>
      <h2>{user.displayName}</h2>
      <p>用户名: {user.username}</p>
      <p>简介: {user.bio}</p>
      <p>关注者: {user.followers}</p>
      <p>关注中: {user.following}</p>
      <img src={user.avatar} alt={user.displayName} />
    </div>
  );
};

// 获取故事列表示例
const StoryListExample: React.FC = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await storyApi.listStories();
        setStories(response.data);
        setLoading(false);
      } catch (err) {
        console.error('获取故事列表失败:', err);
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  if (loading) return <div>加载中...</div>;

  return (
    <div>
      <h2>故事列表</h2>
      <div className="story-list">
        {stories.map((story) => (
          <div key={story.id} className="story-card">
            <h3>{story.title}</h3>
            <p>{story.description}</p>
            <img src={story.coverImage} alt={story.title} />
            <div className="story-meta">
              <span>作者: {story.author.displayName}</span>
              <span>喜欢: {story.likes}</span>
              <span>关注: {story.followers}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 登录功能示例
const LoginExample: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await userApi.login({ username, password });
      // 保存令牌到localStorage
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      // 跳转到首页
      window.location.href = '/';
    } catch (err: any) {
      setError(err.response?.data?.message || '登录失败');
    }
  };

  return (
    <div>
      <h2>登录</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>用户名</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>密码</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="error">{error}</div>}
        <button type="submit">登录</button>
      </form>
    </div>
  );
};

export { UserProfileExample, StoryListExample, LoginExample };
