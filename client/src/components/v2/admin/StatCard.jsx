'use client';

import { Card, Statistic } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

const StatCard = ({ title, value, icon, color, footer, change }) => {
  // Define color styles
  const colors = {
    blue: { bg: '#e6f7ff', icon: '#1890ff' },
    green: { bg: '#f6ffed', icon: '#52c41a' },
    orange: { bg: '#fff7e6', icon: '#fa8c16' },
    red: { bg: '#fff1f0', icon: '#f5222d' },
    purple: { bg: '#f9f0ff', icon: '#722ed1' },
  };

  const selectedColor = colors[color] || colors.blue;

  return (
    <Card styles={{ body: { padding: '20px' } }}>
      <div className="flex items-center mb-2">
        <div
          className="flex items-center justify-center rounded-full mr-3"
          style={{
            width: 40,
            height: 40,
            backgroundColor: selectedColor.bg,
            color: selectedColor.icon,
          }}
        >
          {icon}
        </div>
        <span className="text-gray-500">{title}</span>
      </div>
      <Statistic
        value={value}
        valueStyle={{ fontWeight: 'bold' }}
        suffix={
          change && (
            <span
              style={{
                color: change > 0 ? '#52c41a' : '#f5222d',
                fontSize: '0.8em',
                marginLeft: 8,
              }}
            >
              {change > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              {Math.abs(change)}%
            </span>
          )
        }
      />
      {footer && <div className="mt-2">{footer}</div>}
    </Card>
  );
};

export default StatCard;
