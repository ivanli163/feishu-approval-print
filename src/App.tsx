import React, { useEffect, useState } from 'react';
import { ConfigProvider, theme, Card, Tabs, Space, Button, message } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import {
  FileTextOutlined,
  PrinterOutlined,
  SettingOutlined,
  BarChartOutlined,
  SyncOutlined,
  ToolOutlined,
} from '@ant-design/icons';
import 'antd/dist/reset.css';

import ApprovalRecordsList from './components/ApprovalRecordsList';
import TemplateManager from './components/TemplateManager';
import PrintCenter from './components/PrintCenter';
import Statistics from './components/Statistics';
import AppSettings from './components/AppSettings';
import EnvironmentStatus from './components/EnvironmentStatus';
import { feishuSDK } from './services/feishu-sdk';
import './App.css';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('records');
  const [loading, setLoading] = useState(true);
  const [appInfo, setAppInfo] = useState<any>(null);

  // 初始化应用
  useEffect(() => {
    const initApp = async () => {
      try {
        // 尝试初始化SDK（用于飞书环境）
        await feishuSDK.init();
        const context = feishuSDK.getContext();
        setAppInfo(context);

        // 移除加载动画
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
          loadingElement.style.display = 'none';
        }

        setLoading(false);

        message.success('审批打印插件启动成功！', 2);
      } catch (error) {
        console.log('独立浏览器模式：使用模拟数据运行', error);

        // 移除加载动画
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
          loadingElement.style.display = 'none';
        }

        setLoading(false);

        // 在独立浏览器模式下提供友好的提示
        message.info('正在使用演示数据模式', 2);
      }
    };

    initApp();
  }, []);

  // 同步数据
  const handleSyncAll = async () => {
    try {
      setLoading(true);
      message.info('开始同步数据...', 2);

      // 模拟同步过程
      await new Promise(resolve => setTimeout(resolve, 2000));

      message.success('数据同步完成', 2);
    } catch (error) {
      message.error('同步失败', 2);
    } finally {
      setLoading(false);
    }
  };

  // 独立浏览器模式：始终显示完整应用界面
  const shouldShowFullApp = true;

  // 渲染标签页内容
  const renderTabContent = () => {
    switch (activeTab) {
      case 'records':
        return <ApprovalRecordsList />;
      case 'templates':
        return <TemplateManager />;
      case 'print':
        return <PrintCenter />;
      case 'statistics':
        return <Statistics />;
      case 'settings':
        return <AppSettings />;
      default:
        return <ApprovalRecordsList />;
    }
  };

  // 独立浏览器模式：始终显示完整应用，不再显示环境状态页面
  if (!shouldShowFullApp) {
    return (
      <ConfigProvider
        locale={zhCN}
        theme={{
          algorithm: theme.defaultAlgorithm,
          token: {
            colorPrimary: '#1890ff',
            borderRadius: 8,
          },
        }}
      >
        <div className="app-container">
          {/* 简化的头部 */}
          <div className="app-header">
            <div className="header-content">
              <div className="header-left">
                <h1 className="app-title">
                  🖨️ 审批打印插件
                </h1>
              </div>
              <div className="header-right">
                <Button
                  icon={<ToolOutlined />}
                  onClick={() => setActiveTab('settings')}
                >
                  应用配置
                </Button>
              </div>
            </div>
          </div>

          {/* 环境状态页面 */}
          <div className="app-content">
            {activeTab === 'settings' ? (
              <AppSettings />
            ) : (
              <EnvironmentStatus
                appInfo={appInfo}
                onOpenSettings={() => setActiveTab('settings')}
              />
            )}
          </div>
        </div>
      </ConfigProvider>
    );
  }

  // 正常的飞书环境应用界面
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 8,
        },
      }}
    >
      <div className="app-container">
        {/* 头部区域 */}
        <div className="app-header">
          <div className="header-content">
            <div className="header-left">
              <h1 className="app-title">
                🖨️ 审批打印插件
              </h1>
              {appInfo && (
                <div className="app-info">
                  <span className="info-item">
                    表格ID: <code>{appInfo.tableId}</code>
                  </span>
                  <span className="info-item">
                    用户ID: <code>{appInfo.userId}</code>
                  </span>
                </div>
              )}
            </div>

            <div className="header-right">
              <Space>
                <Button
                  icon={<SyncOutlined />}
                  onClick={handleSyncAll}
                  loading={loading}
                >
                  刷新数据
                </Button>
                <Button
                  icon={<ToolOutlined />}
                  onClick={() => {
                    setActiveTab('settings');
                  }}
                >
                  系统设置
                </Button>
              </Space>
            </div>
          </div>
        </div>

        {/* 主要内容区域 */}
        <div className="app-content">
          <Card
            bordered={false}
            style={{ minHeight: 'calc(100vh - 120px)' }}
            bodyStyle={{ padding: 0 }}
          >
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              type="card"
              size="large"
              items={[
                {
                  key: 'records',
                  label: (
                    <span>
                      <FileTextOutlined />
                      审批记录
                    </span>
                  ),
                  children: renderTabContent(),
                },
                {
                  key: 'templates',
                  label: (
                    <span>
                      <SettingOutlined />
                      模板管理
                    </span>
                  ),
                  children: renderTabContent(),
                },
                {
                  key: 'print',
                  label: (
                    <span>
                      <PrinterOutlined />
                      打印中心
                    </span>
                  ),
                  children: renderTabContent(),
                },
                {
                  key: 'statistics',
                  label: (
                    <span>
                      <BarChartOutlined />
                      数据统计
                    </span>
                  ),
                  children: renderTabContent(),
                },
                {
                  key: 'settings',
                  label: (
                    <span>
                      <ToolOutlined />
                      应用配置
                    </span>
                  ),
                  children: renderTabContent(),
                },
              ]}
            />
          </Card>
        </div>

        {/* 底部信息 */}
        <div className="app-footer">
          <div className="footer-content">
            <span>© 2024 审批打印插件 v1.0.0</span>
            <span>
              {!appInfo ? '演示数据模式' : '集成模式'}
            </span>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default App;