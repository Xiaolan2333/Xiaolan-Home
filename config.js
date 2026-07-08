const SITE_CONFIG = {
  // 浏览器标签页
  title: 'Your Name | 个人主页',
  favicon: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix&backgroundColor=b6e3f4',

  // 基本信息
  name: 'Your Name',
  tagline: '在代码与像素之间，寻找属于自己的浪漫',
  avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix&backgroundColor=b6e3f4',

  // 背景图片
  background: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=80',

  // 页脚
  footer: '本页面除图片外版权归 Xiaolan 所有',

  // 板块配置（按顺序渲染，注释掉或删除不需要的板块）
  sections: [
    // 联系方式板块
    {
      type: 'contact',
      title: '联系方式',
      items: [
        {
          type: 'email',
          icon: '✉',
          label: 'Email',
          value: 'hello@example.com',
          link: 'mailto:hello@example.com'
        },
        {
          type: 'github',
          icon: 'https://cdn.simpleicons.org/github/ffffff',
          label: 'GitHub',
          value: 'github.com/yourname',
          link: 'https://github.com/yourname',
          iconSvg: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>`
        },
        {
          type: 'telegram',
          icon: '✈',
          label: 'Telegram',
          value: '@yourname',
          link: 'https://t.me/yourname'
        },
        {
          type: 'bilibili',
          icon: '▶',
          label: 'Bilibili',
          value: 'bilibili.com/yourid',
          link: 'https://space.bilibili.com/yourid'
        },
        {
          type: 'twitter',
          icon: '𝕏',
          label: 'X / Twitter',
          value: '@yourname',
          link: 'https://x.com/yourname'
        },
        {
          type: 'wechat',
          icon: '微',
          label: 'WeChat',
          value: 'your_wechat_id',
          link: null
        }
      ]
    },

    // 站点导航板块
    {
      type: 'sites',
      title: '站点导航',
      items: [
        {
          name: '个人博客',
          desc: '记录技术思考与生活随笔',
          icon: '📝',
          link: 'https://blog.example.com',
          tag: 'Blog',
          tagColor: 'teal'
        },
        {
          name: 'GitHub',
          desc: '开源项目与代码仓库',
          icon: null,
          iconSvg: `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>`,
          link: 'https://github.com/yourname',
          tag: 'Code',
          tagColor: 'purple'
        },
        {
          name: '技术文档',
          desc: '学习笔记与技术文档沉淀',
          icon: '📚',
          link: 'https://docs.example.com',
          tag: 'Docs',
          tagColor: 'blue'
        },
        {
          name: '在线工具',
          desc: '日常开发中常用的小工具集合',
          icon: '🛠',
          link: 'https://tools.example.com',
          tag: 'Tools',
          tagColor: 'green'
        }
      ]
    },

    // 技术栈板块
    {
      type: 'tech',
      title: '技术栈',
      items: ['React', 'TypeScript', 'Vue', 'Node.js', 'Rust', 'Python', 'PostgreSQL', 'Docker']
    }

    // 可以添加更多板块...
    // {
    //   type: 'custom',
    //   title: '自定义板块',
    //   html: '<p>自定义内容</p>'
    // }
  ]
};
