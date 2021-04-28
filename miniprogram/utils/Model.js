const conditionList = [
  {
    name: "M01_F10_K001",
    id: 0
  },
  {
    name: "M01_F10_KA03",
    id: 1
  },
  {
    name: "M01_F10_KA05",
    id: 2
  },
  {
    name: "M01_F10_KI03",
    id: 3
  },
  {
    name: "M01_F04_KI07",
    id: 4
  },
  {
    name: "M07_F04_K001",
    id: 5
  },
  {
    name: "M07_F04_KA03",
    id: 6
  },
  {
    name: "M07_F04_KA05",
    id: 7
  },
  {
    name: "M07_F04_KI03",
    id: 8
  },
  {
    name: "M07_F04_KI07",
    id: 9
  },
  {
    name: "M07_F10_K001",
    id: 10
  },
  {
    name: "M07_F10_KA03",
    id: 11
  },
  {
    name: "M07_F10_KA05",
    id: 12
  },
  {
    name: "M07_F10_KI03",
    id: 13
  },
  {
    name: "M07_F10_KI07",
    id: 14
  }
]

const attributeList = [
  {
    name: "径向力",
    value: "force"
  },
  {
    name: "第一相电流",
    value: "phase_current_1"
  },
  {
    name: "第二相电流",
    value: "phase_current_2"
  },
  {
    name: "旋转速率",
    value: "speed"
  },
  {
    name: "负荷扭矩",
    value: "torque"
  },
  {
    name: "振动信号",
    value: "vibration_1"
  }
]

const deviceList = [
  {
    id:  1,
    value: "1_M01_F10"
  },
  {
    id:  2,
    value: "2_M01_F10"
  },
  {
    id:  3,
    value: "3_M01_F10"
  },
  {
    id:  4,
    value: "4_M01_F10"
  },
  {
    id:  5,
    value: "5_M07_F04"
  },
  {
    id:  6,
    value: "6_M07_F04"
  },
  {
    id:  7,
    value: "7_M07_F04"
  },
  {
    id:  8,
    value: "8_M07_F04"
  },
  {
    id:  9,
    value: "9_M07_F10"
  },
  {
    id:  10,
    value: "10_M07_F10"
  },
  {
    id:  11,
    value: "11_M07_F10"
  },
  {
    id:  12,
    value: "12_M07_F10"
  }
]

const groupList = ["1","2","3","4","5","6","7","8","9","10"]

const levelList = [
  {
    name: "高",
    value: 0
  },
  {
    name: "中",
    value: 1
  },
  {
    name: "低",
    value: 2
  },
]

export {deviceList, attributeList, groupList, levelList}