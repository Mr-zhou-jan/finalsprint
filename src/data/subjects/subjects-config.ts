// 学科配置索引
export const SUBJECTS_CONFIG = {
  math: {
    subjectId: "math",
    subjectName: "高等数学",
    icon: "∫",
    color: "bg-blue-500",
    examTypes: ["期末考试", "考研数学"],
    knowledgeDomains: [
      "函数与极限", "导数与微分", "中值定理",
      "不定积分", "定积分", "微分方程",
    ],
  },
  physics: {
    subjectId: "physics",
    subjectName: "大学物理",
    icon: "⚛",
    color: "bg-purple-500",
    examTypes: ["期末考试"],
    knowledgeDomains: [
      "质点运动学", "牛顿力学", "刚体", "振动与波",
      "热力学", "静电场", "恒定磁场", "电磁感应",
    ],
  },
  mechanics: {
    subjectId: "mechanics",
    subjectName: "工程力学",
    icon: "⚙",
    color: "bg-amber-500",
    examTypes: ["期末考试"],
    knowledgeDomains: [
      "静力学基础", "平面力系", "空间力系", "轴向拉压",
      "扭转", "弯曲内力", "弯曲应力", "组合变形",
    ],
  },
  tolerance: {
    subjectId: "tolerance",
    subjectName: "互换性与测量技术",
    icon: "📏",
    color: "bg-emerald-500",
    examTypes: ["期末考试"],
    knowledgeDomains: [
      "公差配合基本概念", "标准公差系列", "配合制",
      "几何公差", "表面粗糙度", "测量技术基础",
      "尺寸链", "典型件公差",
    ],
  },
  cpp: {
    subjectId: "cpp",
    subjectName: "程序设计C/C++",
    icon: "⚡",
    color: "bg-rose-500",
    examTypes: ["期末考试", "计算机二级"],
    knowledgeDomains: [
      "基础语法", "函数与作用域", "数组与字符串",
      "指针与引用", "结构体与联合体", "类与对象",
      "继承与多态", "文件操作",
    ],
  },
} as const

export type SubjectId = keyof typeof SUBJECTS_CONFIG