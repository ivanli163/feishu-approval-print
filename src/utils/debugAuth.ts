/**
 * 调试认证状态的工具
 */

import { supabase } from '../utils/supabaseClient';

export const debugAuthState = () => {
  console.log('=== Supabase 调试信息 ===');
  console.log('Supabase URL:', process.env.REACT_APP_SUPABASE_URL);
  console.log('Supabase Key 存在:', !!process.env.REACT_APP_SUPABASE_ANON_KEY);
  console.log('Supabase Key 长度:', process.env.REACT_APP_SUPABASE_ANON_KEY?.length);

  // 测试基本连接
  const testConnection = async () => {
    try {
      console.log('测试 Supabase 连接...');
      const { data, error } = await supabase.from('users').select('count').limit(1);

      if (error) {
        console.error('❌ 连接失败:', error);
        return { success: false, error };
      }

      console.log('✅ 连接成功:', data);
      return { success: true, data };
    } catch (err) {
      console.error('❌ 连接异常:', err);
      return { success: false, error: err };
    }
  };

  // 测试认证状态
  const testAuth = async () => {
    try {
      console.log('检查认证状态...');
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Session:', session);
      console.log('用户已认证:', !!session?.user);
      return { session, isAuthenticated: !!session?.user };
    } catch (err) {
      console.error('❌ 认证检查失败:', err);
      return { session: null, isAuthenticated: false };
    }
  };

  // 运行所有测试
  const runAllTests = async () => {
    console.log('开始运行调试测试...');

    const connectionResult = await testConnection();
    const authResult = await testAuth();

    console.log('=== 测试结果 ===');
    console.log('连接状态:', connectionResult.success ? '✅ 成功' : '❌ 失败');
    console.log('认证状态:', authResult.isAuthenticated ? '✅ 已认证' : '❌ 未认证');
    console.log('========================');

    return {
      connection: connectionResult,
      auth: authResult
    };
  };

  // 在浏览器中全局暴露
  if (typeof window !== 'undefined') {
    window.debugAuthState = debugAuthState;
    window.runAllTests = runAllTests;
    console.log('调试工具已加载！');
    console.log('在控制台中运行: await window.runAllTests()');
  }
};

// 立即运行测试
debugAuthState();