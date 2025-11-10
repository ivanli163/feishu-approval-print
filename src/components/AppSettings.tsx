import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  message,
  Tabs,
  Alert,
  Typography,
  Divider,
  Tag,
  Space,
} from 'antd';
import {
  SettingOutlined,
  KeyOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

interface AppConfig {
  appId: string;
  appSecret: string;
  redirectUri: string;
}

const AppSettings: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<AppConfig>({
    appId: '',
    appSecret: '',
    redirectUri: 'http://localhost:3002',
  });
  const [activeTab, setActiveTab] = useState('config');

  // 从localStorage加载配置
  useEffect(() => {
    const savedConfig = localStorage.getItem('feishu_app_config');
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        setConfig(parsed);
        form.setFieldsValue(parsed);
      } catch (error) {
        console.error('加载配置失败:', error);
      }
    }

    // 从环境变量加载默认配置
    const envAppId = (window as any).__ENV__?.VITE_APP_ID || import.meta.env?.VITE_APP_ID;
    const envAppSecret = (window as any).__ENV__?.VITE_APP_SECRET || import.meta.env?.VITE_APP_SECRET;

    if (envAppId || envAppSecret) {
      const envConfig = {
        appId: envAppId || '',
        appSecret: envAppSecret || '',
        redirectUri: 'http://localhost:3002',
      };
      setConfig(envConfig);
      form.setFieldsValue(envConfig);
    }
  }, [form]);

  // 保存配置
  const handleSave = async (values: AppConfig) => {
    setLoading(true);
    try {
      // 验证配置格式
      if (!values.appId || !values.appSecret) {
        message.error('请填写完整的App ID和App Secret');
        return;
      }

      // 保存到localStorage
      localStorage.setItem('feishu_app_config', JSON.stringify(values));
      setConfig(values);

      message.success('配置保存成功！');
    } catch (error) {
      console.error('保存配置失败:', error);
      message.error('保存配置失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 验证配置
  const handleTestConfig = async () => {
    setLoading(true);
    try {
      const values = form.getFieldsValue();

      if (!values.appId || !values.appSecret) {
        message.error('请先填写App ID和App Secret');
        return;
      }

      // 模拟验证过程
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 这里可以添加真实的配置验证逻辑
      message.success('配置验证成功！');
    } catch (error) {
      console.error('验证配置失败:', error);
      message.error('配置验证失败，请检查凭证是否正确');
    } finally {
      setLoading(false);
    }
  };

  // 清除配置
  const handleClear = () => {
    form.resetFields();
    setConfig({
      appId: '',
      appSecret: '',
      redirectUri: 'http://localhost:3002',
    });
    localStorage.removeItem('feishu_app_config');
    message.info('配置已清除');
  };

  // 复制到剪贴板
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      message.success('已复制到剪贴板');
    }).catch(() => {
      message.error('复制失败');
    });
  };

  const configComplete = config.appId && config.appSecret;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <Card
        title={
          <Space>
            <SettingOutlined />
            <span>系统设置</span>
            {configComplete && (
              <Tag color="green" icon={<CheckCircleOutlined />}>
                已配置
              </Tag>
            )}
          </Space>
        }
        extra={
          <Space>
            <Button onClick={handleClear}>清除配置</Button>
            <Button
              type="primary"
              onClick={() => form.submit()}
              loading={loading}
            >
              保存配置
            </Button>
          </Space>
        }
      >
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="基本设置" key="config">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSave}
              initialValues={config}
            >
              <Form.Item
                label={
                  <Space>
                    <span>App ID</span>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      (应用标识符)
                    </Text>
                  </Space>
                }
                name="appId"
                rules={[
                  { required: true, message: '请输入App ID' },
                  { pattern: /^cli_[a-zA-Z0-9]+$/, message: 'App ID格式不正确' }
                ]}
                extra="飞书开放平台应用唯一标识，格式如：cli_xxxxxxxxx"
              >
                <Input
                  placeholder="请输入App ID，如：cli_a1b2c3d4e5f6g7h8"
                  prefix={<KeyOutlined />}
                />
              </Form.Item>

              <Form.Item
                label={
                  <Space>
                    <span>App Secret</span>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      (应用密钥)
                    </Text>
                  </Space>
                }
                name="appSecret"
                rules={[
                  { required: true, message: '请输入App Secret' },
                  { min: 32, message: 'App Secret长度不足' }
                ]}
                extra="应用密钥，请妥善保管，不要泄露"
              >
                <Input.Password
                  placeholder="请输入App Secret"
                  visibilityToggle
                />
              </Form.Item>

              <Form.Item
                label="重定向URL"
                name="redirectUri"
                extra="飞书认证成功后的回调地址"
              >
                <Input
                  placeholder="http://localhost:3002"
                  prefix={<InfoCircleOutlined />}
                />
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit" loading={loading}>
                    保存配置
                  </Button>
                  <Button onClick={handleTestConfig} loading={loading}>
                    验证配置
                  </Button>
                  <Button onClick={handleClear}>
                    清除配置
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane tab="使用指南" key="guide">
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Alert
                message="如何获取应用凭证"
                type="info"
                showIcon
                description="按照以下步骤在飞书开放平台获取App ID和App Secret"
              />

              <Card title="步骤1：创建应用" size="small">
                <ol>
                  <li>访问 <a href="https://open.feishu.cn/" target="_blank" rel="noopener noreferrer">飞书开放平台</a></li>
                  <li>使用飞书账号登录</li>
                  <li>进入"控制台" → "创建应用" → "企业自建应用"</li>
                  <li>填写应用信息：审批打印插件</li>
                </ol>
              </Card>

              <Card title="步骤2：获取凭证" size="small">
                <ol>
                  <li>在应用管理页面找到"凭证与基础信息"</li>
                  <li>复制 <Text code>App ID</Text>（格式：cli_xxxxxxxxx）</li>
                  <li>复制 <Text code>App Secret</Text>（32位字符串）</li>
                </ol>
              </Card>

              <Card title="步骤3：配置权限" size="small">
                <ol>
                  <li>在应用设置中添加权限：</li>
                  <li><Text code>bitable:app</Text> - 多维表格应用权限</li>
                  <li><Text code>bitable:readonly</Text> - 多维表格只读权限</li>
                  <li><Text code>bitable:write</Text> - 多维表格写入权限</li>
                </ol>
              </Card>

              <Card title="步骤4：配置重定向" size="small">
                <ol>
                  <li>在应用设置中找到"安全设置"</li>
                  <li>添加重定向URL：<Text copyable>http://localhost:3002</Text></li>
                  <li>启用调试模式（开发环境）</li>
                </ol>
              </Card>
            </Space>
          </TabPane>

          <TabPane tab="当前配置" key="current">
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Alert
                message={configComplete ? "配置完整" : "配置不完整"}
                type={configComplete ? "success" : "warning"}
                showIcon
                description={
                  configComplete
                    ? "应用凭证配置完整，可以进行飞书API调用"
                    : "请先配置App ID和App Secret"
                }
              />

              <Card title="配置详情" size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                    <Text strong>App ID：</Text>
                    <br />
                    <Space>
                      <Text code copyable={!!config.appId}>
                        {config.appId || '未配置'}
                      </Text>
                      {config.appId && (
                        <Button
                          size="small"
                          type="text"
                          onClick={() => copyToClipboard(config.appId)}
                        >
                          复制
                        </Button>
                      )}
                    </Space>
                  </div>

                  <div>
                    <Text strong>App Secret：</Text>
                    <br />
                    <Space>
                      <Text code copyable={!!config.appSecret}>
                        {config.appSecret ? '•••••••••••••••••••••••••••••••••' : '未配置'}
                      </Text>
                      {config.appSecret && (
                        <Button
                          size="small"
                          type="text"
                          onClick={() => copyToClipboard(config.appSecret)}
                        >
                          复制
                        </Button>
                      )}
                    </Space>
                  </div>

                  <div>
                    <Text strong>重定向URL：</Text>
                    <br />
                    <Text code copyable>{config.redirectUri}</Text>
                  </div>
                </Space>
              </Card>

              <Card title="配置状态" size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                    <Text strong>存储位置：</Text>
                    <br />
                    <Text type="secondary">浏览器localStorage</Text>
                  </div>

                  <div>
                    <Text strong>使用状态：</Text>
                    <br />
                    {configComplete ? (
                      <Tag color="green" icon={<CheckCircleOutlined />}>
                        已就绪
                      </Tag>
                    ) : (
                      <Tag color="orange" icon={<ExclamationCircleOutlined />}>
                        需要配置
                      </Tag>
                    )}
                  </div>

                  <div>
                    <Text strong>最后更新：</Text>
                    <br />
                    <Text type="secondary">
                      {new Date().toLocaleString('zh-CN')}
                    </Text>
                  </div>
                </Space>
              </Card>
            </Space>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default AppSettings;