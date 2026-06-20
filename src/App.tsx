import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Lock,
  Unlock,
  Settings,
  X,
  Plus,
  Minus,
  Sparkles,
  Compass,
  Users,
  Car,
  ShoppingBag,
  User,
  Wind,
  Zap,
  Volume2,
  Power,
  ChevronRight,
  Shield,
  Gauge,
  Thermometer,
  Clock,
  Eye,
  Settings2,
  MapPin,
  Flame,
  Search,
  CheckCircle,
  Battery,
  RotateCcw,
  Navigation,
  Check,
  ChevronDown
} from 'lucide-react';

export default function App() {
  // Mobile app system states
  const [isLocked, setIsLocked] = useState<boolean>(true);
  const [windowsOpen, setWindowsOpen] = useState<boolean>(false);
  const [trunkOpen, setTrunkOpen] = useState<boolean>(false);
  const [isTempPark, setIsTempPark] = useState<boolean>(false);
  const [tempParkMinutes, setTempParkMinutes] = useState<number>(15);

  // Card 1: 1x5 Vehicle Control States
  const [chargePortOpen, setChargePortOpen] = useState<boolean>(false);
  const [is12VPowerActive, setIs12VPowerActive] = useState<boolean>(true);
  const [hornActive, setHornActive] = useState<boolean>(false); 
  const [lightsFlashing, setLightsFlashing] = useState<boolean>(false);
  const [tirePressureShow, setTirePressureShow] = useState<boolean>(true);

  // Card 2: Smart Climate States
  // "极速升温" is currently active by default and glows in soft cyber-cyan to indicate [Active / 开启中]
  const [climateMode, setClimateMode] = useState<'heat' | 'cool' | 'deodorize' | 'off'>('heat');
  const [targetTemp, setTargetTemp] = useState<number>(27.0); // Adjusted high as heat mode is on
  const [insideTemp, setInsideTemp] = useState<number>(18.5); // Outside to inside heating simulation
  const [pm25, setPm25] = useState<number>(8);

  // Card 3: Smart Parking / Summon States
  const [selectedParkingTab, setSelectedParkingTab] = useState<'summon' | 'remote'>('summon');
  const [summonState, setSummonState] = useState<'idle' | 'moving_forward' | 'moving_backward' | 'auto_parking'>('idle');
  const [summonProgress, setSummonProgress] = useState<number>(0);
  const [parkingMessage, setParkingMessage] = useState<string>('超声波毫米波雷达已经就绪，慢速遥控前后移车');

  // Bottom Navigation Bar active tab ("车控" by default)
  const [activeTab, setActiveTab] = useState<'discover' | 'community' | 'car' | 'shop' | 'profile'>('car');

  // Interactive driving simulation metrics for deep fidelity
  const [range, setRange] = useState<number>(399); 
  const [batteryPercent, setBatteryPercent] = useState<number>(85);
  const [odometer, setOdometer] = useState<number>(12450);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Detail panel overlay triggers for each Card "＞" jump target
  const [activeModal, setActiveModal] = useState<'charging' | 'climate_detail' | 'control_detail' | 'parking_detail' | null>(null);

  // System time string
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('下午 02:30');

  // Simulated destination search state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);

  // Simulated ambient light color state
  const [ambientColor, setAmbientColor] = useState<string>('#00FFFF'); // Cyber-Cyan by default

  // Clock updating loop
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTimeStr(`下午 ${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  // Temperature increment loop to show reality when heating is active
  useEffect(() => {
    const tempInterval = setInterval(() => {
      if (climateMode === 'heat') {
        setInsideTemp(prev => {
          if (prev < targetTemp) {
            return parseFloat((prev + 0.1).toFixed(1));
          }
          return prev;
        });
      } else if (climateMode === 'cool') {
        setInsideTemp(prev => {
          if (prev > targetTemp) {
            return parseFloat((prev - 0.1).toFixed(1));
          }
          return prev;
        });
      } else if (climateMode === 'off') {
        setInsideTemp(prev => {
          if (prev < 24.5) return parseFloat((prev + 0.1).toFixed(1));
          if (prev > 24.5) return parseFloat((prev - 0.1).toFixed(1));
          return prev;
        });
      }
    }, 3000);
    return () => clearInterval(tempInterval);
  }, [climateMode, targetTemp]);

  // Temporary Park timer countdown by minute
  useEffect(() => {
    let interval: any;
    if (isTempPark && tempParkMinutes > 0) {
      interval = setInterval(() => {
        setTempParkMinutes((prev) => {
          if (prev <= 1) {
            setIsTempPark(false);
            showToast('⚠️ 临时车辆停放保护模式时限已到，全车已自动转入智能锁闭空气净化防盗模式');
            return 15;
          }
          return prev - 1;
        });
      }, 60000);
    }
    return () => clearInterval(interval);
  }, [isTempPark, tempParkMinutes]);

  // Double blink light/sound timers
  useEffect(() => {
    if (hornActive) {
      const timer = setTimeout(() => setHornActive(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [hornActive]);

  useEffect(() => {
    if (lightsFlashing) {
      const timer = setTimeout(() => setLightsFlashing(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [lightsFlashing]);

  // Summon progress emulation
  useEffect(() => {
    let interval: any;
    if ((summonState === 'moving_forward' || summonState === 'moving_backward' || summonState === 'auto_parking') && summonProgress < 100) {
      const resolvedState = summonState;
      interval = setInterval(() => {
        setSummonProgress(prev => {
          const step = Math.floor(Math.random() * 6) + 4;
          const next = prev + step;
          if (next >= 100) {
            clearInterval(interval);
            setSummonState('idle');
            if (resolvedState === 'auto_parking') {
              showToast('✅ 自动泊车倒车入库操作成功，阻车档杆已复位，驻车卡爪自动收紧');
              setParkingMessage('自动泊车倒车入库已成功完成，APA泊车控制器切换回睡眠状态');
            } else {
              showToast(`✅ 直线遥控${resolvedState === 'moving_forward' ? '前进' : '后退'}平稳移车已安全停稳`);
              setParkingMessage('直线遥控微动移车已平稳停妥；全防抱雷达静置就绪');
            }
            return 0;
          }
          if (resolvedState === 'auto_parking') {
            setParkingMessage(`自动遥控倒车入库中 ${next}%... 四周超声波安全距离 50cm`);
          } else {
            setParkingMessage(`慢速遥控移动中 ${next}%... 请持续观察车辆四周障碍`);
          }
          return next;
        });
      }, 350);
    }
    return () => clearInterval(interval);
  }, [summonState]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => prev === msg ? null : prev);
    }, 3000);
  };

  const handleLockToggle = () => {
    setIsLocked(!isLocked);
    showToast(!isLocked ? '🔒 车辆安全锁死，四门门拉手内缩，自动折叠后视镜已锁固' : '🔓 智能蓝牙无感钥匙已将四门中控开锁，迎宾座椅后调');
  };

  const handleWindowsToggle = () => {
    setWindowsOpen(!windowsOpen);
    showToast(!windowsOpen ? '🌬️ 已开启一键对角开窗透气通风（车辆空置15分钟后将自动关闭）' : '🪟 全车车窗及防夹玻璃天窗已执行密封闭合阻水操作');
  };

  const handleTrunkToggle = () => {
    setTrunkOpen(!trunkOpen);
    showToast(!trunkOpen ? '📦 电动液压感应尾门已自动上举开启 80%' : '📦 电动尾门已平稳电动下拉并锁闭入锁扣');
  };

  const toggleTempPark = () => {
    if (isTempPark) {
      setIsTempPark(false);
      showToast('⏹️ 临停寻车运行模式已主动退出，全车空调风道已转换');
    } else {
      setIsTempPark(true);
      setTempParkMinutes(15);
      showToast('⚡ 临停寻车空调锁开启中（制冷制热将强制维持15分钟以备随时归车）');
    }
  };

  const adjustClimateMode = (mode: 'heat' | 'cool' | 'deodorize' | 'off') => {
    setClimateMode(mode);
    if (mode === 'off') {
      showToast('💨 智能香氛等离子双温主动净化车载空调已关闭');
    } else if (mode === 'heat') {
      setTargetTemp(27.0);
      showToast('🔥 [极速升温开启中] 双区域PTC加热原件已推至极限，电热座垫加热同步唤醒');
    } else if (mode === 'cool') {
      setTargetTemp(18.0);
      showToast('❄️ [极速降温开启中] 变频压缩机大功率降温，负离子内循环送风吹除浮热');
    } else if (mode === 'deodorize') {
      showToast('🍃 [智能等离净化除味中] 高压等离子杀菌尘埃吸附、外循环快速排除座舱浮异味');
    }
  };

  const handleApplyDestination = (name: string) => {
    setShowSearchResults(false);
    setSearchQuery('');
    showToast(`🗺️ 境行互联：目的地「${name}」已下发至车控大屏，沿途充电最优路径已同步规划！`);
    // increment statistics reactively to show action reward
    setOdometer(prev => prev + 12);
    setBatteryPercent(prev => Math.max(10, prev - 2));
    setRange(prev => Math.max(45, prev - 9));
  };

  // Chinese simulated landmarks for search list
  const chineseDestinations = [
    { name: '超级充电站 · 特斯拉科技港', dist: '1.2 km', addr: '高新技术产业园中区科苑路15-6号' },
    { name: '境行·INJOY 官方品牌中心体验店', dist: '3.5 km', addr: '万象汇时尚购物广场南区A座101' },
    { name: '国家电网分布式直流高压充电广场', dist: '4.8 km', addr: '龙岗青年大道环线280号B3地下枢纽' },
    { name: '虹桥国际机场P4超级高压换电站', dist: '18.2 km', addr: '虹桥空港大道一号航站楼立体库A侧' }
  ];

  return (
    <div className="w-full min-h-screen bg-[#EBEFF3] text-zinc-900 font-sans flex flex-col justify-center items-center selection:bg-cyan-500/10 select-none overflow-x-hidden p-0 sm:p-4">
      
      {/* 9:16 ISOLATED VIEWPORT TO REPLICATE THE SCREENSHOT EXACTLY AND KEEP ABSOLUTE 2D FIDELITY */}
      <div className="w-full max-w-[430px] h-[100dvh] sm:h-[880px] bg-[#F5F7FA] flex flex-col justify-between shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] relative overflow-hidden sm:rounded-[40px] border border-zinc-200/50">
        
        {/* GLOBAL DURATION TRACING TOASTS */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -45, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="absolute top-14 inset-x-4 bg-zinc-900/95 backdrop-blur-md text-white rounded-2xl p-4 z-50 flex items-start space-x-3 shadow-2xl border border-white/10"
            >
              <div className="h-6 w-6 rounded-full bg-cyan-400 flex items-center justify-center flex-shrink-0 mt-0.5 animate-pulse">
                <Sparkles className="w-3.5 h-3.5 text-zinc-950" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-[10px] text-cyan-300 font-black uppercase tracking-wider">境行·INJOY 实时座舱状态</p>
                <p className="text-xs font-bold mt-0.5 leading-relaxed text-zinc-100">{toastMessage}</p>
              </div>
              <button onClick={() => setToastMessage(null)} className="text-zinc-400 hover:text-white transition-colors pl-1">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SETTINGS PANEL OVERLAY */}
        <AnimatePresence>
          {isSettingsOpen && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="absolute inset-x-0 bottom-0 top-11 bg-white z-[60] rounded-t-[32px] shadow-2xl flex flex-col p-6 overflow-y-auto"
            >
              <div className="flex justify-between items-center pb-5 mb-5 border-b border-zinc-100">
                <div>
                  <h3 className="text-base font-black tracking-tight text-zinc-900">境行·INJOY 车辆极速调试</h3>
                  <p className="text-[10px] text-zinc-400 font-bold mt-0.5">整车固件版本: v3.4.15-Pro</p>
                </div>
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="h-10 w-10 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-full flex items-center justify-center transition-colors outline-none"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Range & Battery Customizer */}
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-xs font-black text-zinc-600">模拟续航与剩余动力电量</span>
                    <span className="text-xs font-black text-cyan-600">{range} km ({batteryPercent}%)</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={batteryPercent}
                    onChange={(e) => {
                      const bat = parseInt(e.target.value);
                      setBatteryPercent(bat);
                      // 100% is 470km maximum WLTP
                      setRange(Math.round((bat / 100) * 470));
                    }}
                    className="w-full accent-cyan-500 h-2 bg-zinc-100 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-zinc-400 mt-1.5 font-black">
                    <span>10% (极端电量保护)</span>
                    <span>100% (满电最高续航)</span>
                  </div>
                </div>

                {/* Simulated Odometer */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-xs font-black text-zinc-600">车辆仪表积累总里程</span>
                    <span className="text-xs font-black text-zinc-900">{odometer.toLocaleString()} km</span>
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="60000"
                    step="500"
                    value={odometer}
                    onChange={(e) => setOdometer(parseInt(e.target.value))}
                    className="w-full accent-cyan-500 h-2 bg-zinc-100 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Sentry Mode & Security */}
                <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-100 space-y-4 text-left">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-xs font-black text-zinc-800">OTA 诊断与整车体检</h4>
                      <p className="text-[10px] text-zinc-400 mt-0.5">所有集成电子驱动控制模块均无异常</p>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full font-black">正常运行</span>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-zinc-200/60">
                    <div>
                      <h4 className="text-xs font-black text-zinc-800">氛围灯色彩调节</h4>
                      <p className="text-[10px] text-zinc-400 mt-0.5">配置全车发光导光条的环境色彩</p>
                    </div>
                    <div className="flex space-x-1.5">
                      {['#00FFFF', '#FF5555', '#44FF44', '#FFAA00', '#D400FF'].map((c) => (
                        <button
                          key={c}
                          onClick={() => {
                            setAmbientColor(c);
                            showToast(`💡 境行座舱变幻氛围灯色：${
                              c === '#00FFFF' ? '赛博青蓝' : c === '#FF5555' ? '运动焰红' : c === '#44FF44' ? '极光新绿' : c === '#FFAA00' ? '暖金夕阳' : '科幻魅紫'
                            }`);
                          }}
                          className={`w-5 h-5 rounded-full border ${ambientColor === c ? 'ring-2 ring-zinc-900 border-white' : 'border-zinc-300'}`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Reset button */}
                <button
                  onClick={() => {
                    setBatteryPercent(85);
                    setRange(399);
                    setOdometer(12450);
                    setClimateMode('heat');
                    setPm25(8);
                    setTargetTemp(27.0);
                    setInsideTemp(18.5);
                    setAmbientColor('#00FFFF');
                    setIsSettingsOpen(false);
                    showToast('🔄 境行·INJOY 体验模拟数据已恢复至出厂推荐标准(399km极限续航)');
                  }}
                  className="w-full bg-zinc-950 text-white font-extrabold text-[12px] py-4 rounded-2xl hover:bg-black active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>重置并恢复极简推荐标定</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* DETAILS OVERLAY / CHARGING CENTER OR OTHER CARD MODALS */}
        <AnimatePresence>
          {activeModal && (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="absolute inset-x-0 bottom-0 top-11 bg-white z-50 rounded-t-[32px] p-6 shadow-2xl flex flex-col justify-between"
            >
              <div className="text-left">
                <div className="flex justify-between items-center pb-4 mb-4 border-b border-zinc-100">
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-6 bg-cyan-500 rounded-full" />
                    <h3 className="text-base font-black text-zinc-900">
                      {activeModal === 'charging' && '⚡ 智能充电与快充中心'}
                      {activeModal === 'climate_detail' && '🌬️ 智能空气净化与双区空调'}
                      {activeModal === 'control_detail' && '🎛️ 车辆综合传感器监视器'}
                      {activeModal === 'parking_detail' && '🅿️ 遥控泊车辅助与APA控制台'}
                    </h3>
                  </div>
                  <button onClick={() => setActiveModal(null)} className="h-8 w-8 bg-zinc-100 rounded-full flex items-center justify-center">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {activeModal === 'charging' && (
                  <div className="space-y-4">
                    <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-200/50">
                      <p className="text-[11px] text-zinc-400 font-black uppercase">直流快充连接状态</p>
                      <div className="flex items-baseline space-x-2 mt-1">
                        <span className="text-2xl font-black text-zinc-900">
                          {chargePortOpen ? '等待直流充电枪插入' : '充电舱密封盖已锁闭'}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-500 mt-1">高压高流连接口已保护，电量维持 85% 续航 399 km (WLTP规格下计算)</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => {
                          setBatteryPercent(100);
                          setRange(470);
                          showToast('⚡ 充电模拟：电能量已安全充至 100%，满载剩余续航 470km WLTP');
                        }}
                        className="bg-zinc-900 hover:bg-black text-white p-3 rounded-2xl text-xs font-black"
                      >
                        模拟电量瞬间充至100%
                      </button>
                      <button
                        onClick={() => {
                          setBatteryPercent(15);
                          setRange(70);
                          showToast('⚠️ 电量模拟降至 15% 临界低压报警，已为您搜寻最近超级充电网络');
                        }}
                        className="bg-white border border-zinc-200 text-zinc-900 p-3 rounded-2xl text-xs font-black"
                      >
                        模拟低电报警 (15%)
                      </button>
                    </div>

                    <div className="pt-2">
                      <p className="text-xs font-black text-zinc-800 mb-2">推荐周边快速充电桩 (无界智能推送)</p>
                      {chineseDestinations.slice(0, 2).map((item, idx) => (
                        <div key={idx} className="p-3 bg-zinc-50 rounded-xl mb-2 border border-zinc-100 flex justify-between items-center">
                          <div>
                            <p className="text-xs font-bold text-zinc-800">{item.name}</p>
                            <p className="text-[10px] text-zinc-400 mt-0.5">{item.addr}</p>
                          </div>
                          <span className="text-[10px] font-black text-zinc-900 font-mono">{item.dist}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeModal === 'climate_detail' && (
                  <div className="space-y-4">
                    <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 text-center">
                      <p className="text-[10px] text-zinc-400 font-black">当前车舱实时温度</p>
                      <h4 className="text-3xl font-black text-zinc-900 mt-1">{insideTemp} °C</h4>
                      <p className="text-[10px] text-cyan-600 font-bold mt-1">等离子发生器正常工作中 · 循环风速「自动」</p>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-black text-zinc-700">车载智能香氛选配</p>
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          {['莫奈清晨 (幽兰香)', '星际深邃 (木质调)', '森林露水 (松草香)'].map((smell, idx) => (
                            <button
                              key={idx}
                              onClick={() => showToast(`🍃 车载空调智能香氛已切换至：「${smell}」`)}
                              className="bg-zinc-50 border border-zinc-200 p-2 text-[10px] font-black rounded-xl hover:bg-zinc-100 active:scale-95"
                            >
                              {smell}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2">
                        <div className="flex justify-between items-center">
                          <p className="text-xs font-black text-zinc-700">CN95高效空调滤芯寿命</p>
                          <span className="text-xs font-mono font-black text-emerald-600">剩余 92%</span>
                        </div>
                        <div className="w-full bg-zinc-200 h-2 rounded-full overflow-hidden mt-1.5">
                          <div className="bg-emerald-500 h-full w-[92%]" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeModal === 'control_detail' && (
                  <div className="space-y-4">
                    <p className="text-xs text-zinc-500">
                      通过境行超级智联传感器持续监测所有车身传感器与继电器状态。
                    </p>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-100">
                        <span className="text-[11px] text-zinc-400 block font-bold">12V 动力蓄电池</span>
                        <span className="text-sm font-black text-zinc-800 mt-1 block">13.8V (状态优秀)</span>
                      </div>
                      <div className="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-100">
                        <span className="text-[11px] text-zinc-400 block font-bold">行车高压绝缘阻值</span>
                        <span className="text-sm font-black text-emerald-600 mt-1 block">500 MΩ (安全)</span>
                      </div>
                      <div className="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-100">
                        <span className="text-[11px] text-zinc-400 block font-bold">制动系统液压油率</span>
                        <span className="text-sm font-black text-zinc-800 mt-1 block">100% (润滑完美)</span>
                      </div>
                      <div className="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-100">
                        <span className="text-[11px] text-zinc-400 block font-bold">全防撞雷达覆盖面</span>
                        <span className="text-sm font-black text-zinc-800 mt-1 block">360° 无盲区包裹</span>
                      </div>
                    </div>

                    <button
                      onClick={() => showToast('🔊 鸣笛报警寻车：已发送短音震慑波 2 Hz 测试')}
                      className="w-full py-3.5 bg-zinc-950 text-white font-black text-xs rounded-2xl"
                    >
                      向控制舱发送传感器全诊断测试
                    </button>
                  </div>
                )}

                {activeModal === 'parking_detail' && (
                  <div className="space-y-4 text-left">
                    <p className="text-xs text-zinc-500">
                      境行INJOY 全场景自适应遥控泊车（APA）可以在无需车主干预的情况下，自动接管动力转向及油门刹车，直线精确泊入泊出。
                    </p>

                    <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                      <p className="text-xs font-black text-zinc-800">全场景泊车算法安全说明</p>
                      <ul className="text-[10px] text-zinc-500 space-y-1 mt-2.5 list-disc list-inside">
                        <li>请确保车辆四周无直径小于 10 厘米的低矮凸起尖锐障碍</li>
                        <li>车主需通过手机屏幕手势保持在 5 米安全视距内长按运行</li>
                        <li>毫米波雷达与超高精摄像头将以 20 毫秒的高帧率进行无延迟碰撞运算</li>
                      </ul>
                    </div>

                    <div className="bg-cyan-50 border border-cyan-105 p-3 rounded-xl">
                      <p className="text-[9.5px] text-cyan-800 font-black leading-snug">
                        ● 智能泊车正在托管中。如遇行人及宠物，系统检测后将强制驻车点刹防滑。
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => setActiveModal(null)}
                className="w-full bg-zinc-900 text-white py-4 text-xs font-black rounded-2xl hover:bg-black active:scale-[0.98] transition-all"
              >
                返回爱车控制面板
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CONTAINER VIEW FOR NAVIGATION TABS */}
        <div className="flex-1 flex flex-col justify-between overflow-y-auto no-scrollbar pb-18">
          
          {/* HEADER BAR (TIME & PHONE STATS - GEELY / XPENG COMPLIANT STYLE) */}
          <div className="flex items-center justify-between px-6 pt-3 pb-1 bg-[#F5F7FA] z-20">
            {/* Left: Time indicator */}
            <span className="text-[12px] font-extrabold tracking-tighter text-zinc-900 leading-none">{currentTimeStr}</span>
            
            {/* Center Header Brand Badge */}
            <span className="text-[10px] font-black tracking-widest text-zinc-500 pl-4">境行 · INJOY</span>

            {/* Right: Signal, Wifi and Battery */}
            <div className="flex items-center space-x-2 text-zinc-900">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 mr-0.5 animate-pulse" title="无感蓝牙信号连接" />
              {/* Network signal bars */}
              <div className="flex items-end space-x-[2px] h-3">
                <span className="w-[1.8px] h-1.5 bg-zinc-900 rounded-[1px]" />
                <span className="w-[1.8px] h-2 bg-zinc-900 rounded-[1px]" />
                <span className="w-[1.8px] h-2.5 bg-zinc-900 rounded-[1px]" />
                <span className="w-[1.8px] h-[11px] bg-zinc-900 rounded-[1px]" />
                <span className="w-[1.8px] h-3 bg-zinc-900 rounded-[1px]" />
              </div>
              <span className="text-[10px] font-sans font-bold tracking-tight">5G</span>
              {/* Battery representation */}
              <div className="flex items-center space-x-0.5 border border-zinc-900/80 rounded-[4px] p-[2px] px-[2.5px] h-[14px]">
                <div className="w-[12px] h-full bg-zinc-900 rounded-[1.5px]" />
                <div className="w-[1.2px] h-1.5 bg-zinc-900/80 rounded-r-[1px]" />
              </div>
              <span className="text-[10px] font-bold font-mono">89</span>
            </div>
          </div>

          {/* ACTIVE CONTENT RENDER ZONE */}
          <AnimatePresence mode="wait">
            
            {/* TAB CONTENT: ACTIVE VEHICLE DASHBOARD (爱车 CONTROL PAGE) */}
            {activeTab === 'car' && (
              <motion.div
                key="car"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col pt-1 px-4 space-y-3.5"
              >
                
                {/* TOP HEADER AREA: RANGE & WLTP & PADLOCK */}
                <div id="top-area-section" className="flex items-end justify-between px-1 pt-1 pb-1">
                  
                  {/* Left block: WLTP Range Indicator */}
                  <div className="text-left">
                    <div className="flex items-baseline space-x-1">
                      <span className="text-3xl font-black tracking-tight text-black leading-none">
                        {range}
                      </span>
                      <span className="text-xs font-black text-zinc-900">km</span>
                      <span className="align-super inline-block text-[8px] font-sans font-black border border-zinc-400 px-1 py-0.5 rounded bg-zinc-100 text-zinc-600 leading-none tracking-wide ml-1">
                        WLTP
                      </span>
                    </div>
                    {/* Charging interactive link with clean underline style */}
                    <button
                      onClick={() => setActiveModal('charging')}
                      className="text-[11px] text-zinc-950 font-black hover:text-cyan-600 mt-1 flex items-center space-x-1 outline-none relative group"
                    >
                      <span className="underline decoration-2 decoration-cyan-400 underline-offset-4">充电中心 ＞</span>
                    </button>
                  </div>

                  {/* Right block: Settings Cog & Locked text with padlock icon */}
                  <div className="flex items-center space-x-2">
                    {/* Locked Status Button */}
                    <button
                      onClick={handleLockToggle}
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white border border-zinc-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] text-zinc-900 active:scale-95 transition-all outline-none"
                    >
                      {isLocked ? (
                        <>
                          <Lock className="w-3.5 h-3.5 text-zinc-950 stroke-[3]" />
                          <span className="text-[10.5px] font-black text-zinc-950">车门已锁</span>
                        </>
                      ) : (
                        <>
                          <Unlock className="w-3.5 h-3.5 text-cyan-600 stroke-[3]" />
                          <span className="text-[10.5px] font-black text-cyan-600 animate-pulse">车门已开</span>
                        </>
                      )}
                    </button>

                    {/* Settings Trigger Icon */}
                    <button
                      onClick={() => setIsSettingsOpen(true)}
                      className="h-8 w-8 bg-white border border-zinc-200/80 rounded-full flex items-center justify-center text-zinc-700 shadow-[0_1px_6px_rgba(0,0,0,0.02)] hover:bg-zinc-50 active:scale-95 transition-all outline-none"
                      title="打开车辆配置调试面板"
                    >
                      <Settings className="w-4 h-4 text-zinc-800" />
                    </button>
                  </div>
                </div>

                {/* UPPER CENTER: PHOTOREALISTIC VEHICLE CANVAS (3/4 Front SUV) */}
                <div id="upper-center-studio" className="relative w-full rounded-none bg-white border border-zinc-200/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden p-4 flex flex-col justify-center items-center">
                  
                  {/* Digital Twin Title Badge */}
                  <div className="absolute top-2.5 left-3 px-2 py-0.5 rounded bg-zinc-50 border border-zinc-100/80 flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                    <span className="text-[8px] font-sans font-black text-zinc-400 uppercase tracking-widest">3D 数智双生</span>
                  </div>

                  {/* Temporary Park Badge */}
                  {isTempPark && (
                    <div className="absolute top-2.5 right-3 bg-amber-500 text-white text-[8px] font-black px-2 py-0.5 rounded flex items-center space-x-1 animate-pulse">
                      <Clock className="w-2.5 h-2.5" />
                      <span>临停剩 {tempParkMinutes} 分钟</span>
                    </div>
                  )}

                  {/* HIGH RESOLUTION VEHICLE ASSET STAGE */}
                  <div className="relative w-full h-34 mt-2 flex justify-center items-center">
                    
                    {/* Cyber Ambient Color Underglow reflection dynamic emulation */}
                    <div
                      className="absolute bottom-1 w-[200px] h-8 blur-2xl rounded-full opacity-40 transition-all duration-700 z-0 pointer-events-none"
                      style={{ backgroundColor: ambientColor }}
                    />

                    {/* Flash lights effect visual overlay */}
                    <AnimatePresence>
                      {lightsFlashing && (
                        <>
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: [0, 1, 0, 1, 0], scale: 1.1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.5 }}
                            className="absolute left-[38px] top-[68px] w-10 h-10 rounded-full bg-cyan-300/40 blur-md z-30"
                          />
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: [0, 1, 0, 1, 0], scale: 1.1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.5 }}
                            className="absolute right-[52px] top-[54px] w-10 h-10 rounded-full bg-cyan-300/40 blur-md z-30"
                          />
                        </>
                      )}
                    </AnimatePresence>

                    {/* Horn animation rings */}
                    <AnimatePresence>
                      {hornActive && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: [0.6, 0], scale: [0.9, 1.7] }}
                          exit={{ opacity: 0 }}
                          transition={{ repeat: 3, duration: 0.4 }}
                          className="absolute left-[30%] top-[35%] w-28 h-28 rounded-full border-2 border-cyan-500/50 z-30 pointer-events-none"
                        />
                      )}
                    </AnimatePresence>

                    {/* Wind draft indicators for active climate */}
                    <AnimatePresence>
                      {climateMode !== 'off' && (
                        <div className="absolute inset-0 z-30 pointer-events-none">
                          <motion.div
                            animate={{ x: [10, -10, 10], opacity: [0.2, 0.5, 0.2] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className={`absolute top-8 left-14 text-[10px] ${climateMode === 'heat' ? 'text-amber-500' : 'text-sky-400'}`}
                          >
                            <Wind className="w-5 h-5 opacity-40" />
                          </motion.div>
                          <motion.div
                            animate={{ x: [-10, 10, -10], opacity: [0.25, 0.55, 0.25] }}
                            transition={{ repeat: Infinity, duration: 2.2 }}
                            className={`absolute top-12 right-22 text-[10px] ${climateMode === 'heat' ? 'text-amber-500' : 'text-sky-400'}`}
                          >
                            <Wind className="w-5 h-5 opacity-40" />
                          </motion.div>
                        </div>
                      )}
                    </AnimatePresence>

                    {/* Charge Port Opening flashing connector */}
                    {chargePortOpen && (
                      <motion.div
                        animate={{ scale: [0.9, 1.2, 0.9] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="absolute right-[48px] bottom-[34px] z-30 bg-emerald-500 text-white rounded-full p-1 border border-white shadow-lg flex items-center justify-center cursor-pointer"
                        onClick={() => showToast('🔌 充电口已电机解锁开启，即刻插枪开始直流快速补能')}
                      >
                        <Zap className="w-2.5 h-2.5" />
                      </motion.div>
                    )}

                    {/* HIGH-RES PHOTOREALISTIC VEHICLE MODEL */}
                    <img
                      src="/src/assets/images/white_luxury_electric_suv_1781544193311.jpg"
                      alt="境行电驱SUV双生"
                      referrerPolicy="no-referrer"
                      className="w-[265px] h-auto object-contain select-none z-10 hover:scale-103 transition-transform duration-500 relative cursor-pointer"
                      onClick={() => {
                        setLightsFlashing(true);
                        setHornActive(true);
                        showToast('🚘 触发车辆双生迎宾唤醒（近光LED星轨呼吸灯已连闪 + 笛鸣测试）');
                      }}
                    />

                    {/* Pure, Flat Ground Shadow */}
                    <div className="absolute bottom-[16px] left-[15%] w-[70%] h-4 bg-radial from-black/20 via-black/5 to-transparent blur-[4px] rounded-[100%] z-0 pointer-events-none" />
                  </div>

                  {/* ACTIVE LIVE GAUGE TIRE SCREEN */}
                  <AnimatePresence>
                    {tirePressureShow && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="w-full flex justify-between items-center bg-zinc-50 p-2 px-3 rounded-xl border border-zinc-100 mt-1.5 z-20"
                      >
                        <div className="flex items-center space-x-1.5">
                          <Gauge className="w-3.5 h-3.5 text-zinc-400" />
                          <span className="text-[9.5px] text-zinc-400 font-black">四轮胎压自检</span>
                        </div>
                        <div className="flex space-x-3 text-[9.5px] font-extrabold font-mono text-zinc-800">
                          <div className="flex flex-col items-center">
                            <span className="text-[7.5px] text-zinc-400 font-sans">左前</span>
                            <span>2.5 <span className="text-[7.5px] text-zinc-400 font-sans">bar</span></span>
                          </div>
                          <div className="w-[1px] h-3.5 bg-zinc-200 self-center" />
                          <div className="flex flex-col items-center">
                            <span className="text-[7.5px] text-zinc-400 font-sans">右前</span>
                            <span className="text-amber-600">2.4 <span className="text-[7.5px] font-sans text-zinc-400">bar</span></span>
                          </div>
                          <div className="w-[1px] h-3.5 bg-zinc-200 self-center" />
                          <div className="flex flex-col items-center">
                            <span className="text-[7.5px] text-zinc-400 font-sans">左后</span>
                            <span>2.5 <span className="text-[7.5px] text-zinc-400 font-sans">bar</span></span>
                          </div>
                          <div className="w-[1px] h-3.5 bg-zinc-200 self-center" />
                          <div className="flex flex-col items-center">
                            <span className="text-[7.5px] text-zinc-400 font-sans">右后</span>
                            <span>2.5 <span className="text-[7.5px] text-zinc-400 font-sans">bar</span></span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* DESTINATION SEARCH BAR */}
                <div className="relative w-full z-10">
                  <div className="flex items-center bg-white border border-zinc-200/50 rounded-2xl p-0.5 shadow-[0_2px_10px_rgba(0,0,0,0.01)]">
                    <div className="pl-3.5 text-zinc-400">
                      <Search className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowSearchResults(e.target.value.length > 0);
                      }}
                      onFocus={() => {
                        if (searchQuery.length > 0) setShowSearchResults(true);
                      }}
                      placeholder="搜索充电网点、心愿目的地"
                      className="w-full pl-2 pr-4 py-2 text-xs font-bold leading-none bg-transparent text-zinc-800 placeholder-zinc-400 focus:outline-none"
                    />
                    {searchQuery.length > 0 && (
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setShowSearchResults(false);
                        }}
                        className="text-zinc-400 hover:text-zinc-600 pr-3"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Search Dropdown Drawer */}
                  <AnimatePresence>
                    {showSearchResults && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="absolute w-full mt-1.5 bg-white rounded-2xl shadow-xl border border-zinc-200/80 p-3 z-40 space-y-1.5 max-h-56 overflow-y-auto"
                      >
                        <div className="flex justify-between items-center px-1 pb-1 border-b border-zinc-100">
                          <span className="text-[9px] text-zinc-400 font-black uppercase">智联推送 · 推荐补能目的地</span>
                          <button onClick={() => setShowSearchResults(false)} className="text-[9px] font-black text-cyan-600">
                            关闭
                          </button>
                        </div>
                        {chineseDestinations
                          .filter(d => d.name.includes(searchQuery) || d.addr.includes(searchQuery))
                          .map((d, i) => (
                            <div
                              key={i}
                              onClick={() => handleApplyDestination(d.name)}
                              className="flex justify-between items-start p-2 rounded-xl hover:bg-zinc-50 transition-colors cursor-pointer"
                            >
                              <div className="text-left">
                                <p className="text-xs font-extrabold text-zinc-800">{d.name}</p>
                                <p className="text-[9.5px] text-zinc-400 mt-0.5">{d.addr}</p>
                              </div>
                              <span className="text-[9px] font-mono font-black text-zinc-800 flex-shrink-0">{d.dist}</span>
                            </div>
                          ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* PERMANENT QUICK DOCK: 4 HORIZONTAL BUTTONS WITH PILLED OUTLINE STROKE */}
                <div id="high-frequency-shortcut-row" className="grid grid-cols-4 gap-3 bg-[#F5F7FA] py-1">
                  
                  {/* Button 1: 车锁 */}
                  <button
                    onClick={handleLockToggle}
                    className="flex flex-col items-center group outline-none"
                  >
                    <div className={`h-14 w-14 rounded-xl flex flex-col items-center justify-center transition-all duration-300 border relative overflow-hidden ${
                      isLocked
                        ? 'bg-zinc-950 border-zinc-950 text-white shadow-sm'
                        : 'bg-white border-zinc-200 text-zinc-900 shadow-[0_1px_4px_rgba(0,0,0,0.015)] group-active:scale-95'
                    }`}>
                      {/* Interactive Touch Pill representation */}
                      <span className="absolute top-1.5 w-7 h-1 rounded-full bg-zinc-400/40 border border-zinc-500/10" />
                      <Lock className="w-5 h-5 stroke-[2] mt-1.5" />
                    </div>
                    <span className="text-[11px] font-black text-zinc-900 mt-2">
                      车锁
                    </span>
                  </button>

                  {/* Button 2: 车窗 */}
                  <button
                    onClick={handleWindowsToggle}
                    className="flex flex-col items-center group outline-none"
                  >
                    <div className={`h-14 w-14 rounded-xl flex flex-col items-center justify-center transition-all duration-300 border relative overflow-hidden ${
                      windowsOpen
                        ? 'bg-zinc-950 border-zinc-950 text-white shadow-sm'
                        : 'bg-white border-zinc-200 text-zinc-900 shadow-[0_1px_4px_rgba(0,0,0,0.015)] group-active:scale-95'
                    }`}>
                      <span className="absolute top-1.5 w-7 h-1 rounded-full bg-zinc-400/40 border border-zinc-500/10" />
                      <Wind className="w-5 h-5 stroke-[2] mt-1.5" />
                    </div>
                    <span className="text-[11px] font-black text-zinc-900 mt-2">
                      车窗
                    </span>
                  </button>

                  {/* Button 3: 后备箱 */}
                  <button
                    onClick={handleTrunkToggle}
                    className="flex flex-col items-center group outline-none"
                  >
                    <div className={`h-14 w-14 rounded-xl flex flex-col items-center justify-center transition-all duration-300 border relative overflow-hidden ${
                      trunkOpen
                        ? 'bg-zinc-950 border-zinc-950 text-white shadow-sm'
                        : 'bg-white border-zinc-200 text-zinc-900 shadow-[0_1px_4px_rgba(0,0,0,0.015)] group-active:scale-95'
                    }`}>
                      <span className="absolute top-1.5 w-7 h-1 rounded-full bg-zinc-400/40 border border-zinc-500/10" />
                      <Car className="w-5 h-5 stroke-[2] mt-1.5" />
                    </div>
                    <span className="text-[11px] font-black text-zinc-900 mt-2">
                      后备箱
                    </span>
                  </button>

                  {/* Button 4: 临停寻车 */}
                  <button
                    onClick={toggleTempPark}
                    className="flex flex-col items-center group outline-none"
                  >
                    <div className={`h-14 w-14 rounded-xl flex flex-col items-center justify-center transition-all duration-300 border relative overflow-hidden ${
                      isTempPark
                        ? 'bg-cyan-500 border-cyan-600 text-white shadow-sm'
                        : 'bg-white border-zinc-200 text-zinc-900 shadow-[0_1px_4px_rgba(0,0,0,0.015)] group-active:scale-95'
                    }`}>
                      <span className="absolute top-1.5 w-7 h-1 rounded-full bg-cyan-400/50 border border-cyan-500/10" />
                      <Clock className="w-5 h-5 stroke-[2] mt-1.5" />
                    </div>
                    <span className="text-[11px] font-black text-zinc-900 mt-2">
                      临停寻车
                    </span>
                  </button>

                </div>

                {/* BENTO GRID CARDS SYSTEM (TAB/CARD BASED, NO ENDLESS SCROLLING) */}
                <div className="flex flex-col space-y-3.5">
                  
                  {/* CARD 1: 车辆控制 BENTO CARD (1x5 Circular Icons with details arrow jump link) */}
                  <div className="p-4 bg-white rounded-none border border-zinc-200/50 shadow-[0_2px_8px_rgba(0,0,0,0.025)] text-left relative">
                    {/* Header with detailed arrow jump action */}
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">车辆控制 · VEHICLE CONTROL</p>
                      <button
                        onClick={() => setActiveModal('control_detail')}
                        className="text-xs font-black text-zinc-900 flex items-center space-x-1 hover:text-cyan-600 outline-none"
                        title="查看传感器诊断诊断详情"
                      >
                        <span className="text-[10px] font-bold">详情分析</span>
                        <span className="font-extrabold text-[#111827]">＞</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-5 gap-1.5 justify-items-center">
                      
                      {/* 1. 充电口 */}
                      <button
                        onClick={() => {
                          setChargePortOpen(!chargePortOpen);
                          showToast(!chargePortOpen ? '🔌 车辆高压充电盖舱门已解开弹出' : '🔌 充电口阻盖气压闭合');
                        }}
                        className="flex flex-col items-center space-y-1.5 outline-none group"
                      >
                        <div className={`h-11 w-11 rounded-full flex items-center justify-center transition-all ${
                          chargePortOpen ? 'bg-zinc-100 ring-2 ring-zinc-900 text-zinc-950' : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-700'
                        }`}>
                          <Zap className="w-4 h-4 stroke-[2]" />
                        </div>
                        <span className="text-[9.5px] font-black text-zinc-800">充电口</span>
                      </button>

                      {/* 2. 12V电源 */}
                      <button
                        onClick={() => {
                          setIs12VPowerActive(!is12VPowerActive);
                          showToast(is12VPowerActive ? '⚠️ 12V蓄电池输出已转入休眠保护，中控息屏' : '🔋 12V辅佐电力恢复通电，传感器就位');
                        }}
                        className="flex flex-col items-center space-y-1.5 outline-none group"
                      >
                        <div className={`h-11 w-11 rounded-full flex items-center justify-center transition-all ${
                          is12VPowerActive ? 'bg-zinc-100 ring-2 ring-zinc-900 text-zinc-950' : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-700'
                        }`}>
                          <Power className="w-4 h-4 stroke-[2.5]" />
                        </div>
                        <span className="text-[9.5px] font-black text-zinc-800">12V电源</span>
                      </button>

                      {/* 3. 鸣笛 */}
                      <button
                        onClick={() => {
                          setHornActive(true);
                          showToast('🔊 警报鸣笛：低音微鸣试验进行，喇叭振膜工作正常');
                        }}
                        className="flex flex-col items-center space-y-1.5 outline-none group"
                      >
                        <div className={`h-11 w-11 rounded-full flex items-center justify-center transition-all ${
                          hornActive ? 'bg-zinc-100 ring-2 ring-zinc-900 text-zinc-950' : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-700'
                        }`}>
                          <Volume2 className="w-4 h-4 stroke-[2]" />
                        </div>
                        <span className="text-[9.5px] font-black text-zinc-800">鸣笛</span>
                      </button>

                      {/* 4. 闪灯 */}
                      <button
                        onClick={() => {
                          setLightsFlashing(true);
                          showToast('💡 前LED星链远近灯组已进行了三次极光频闪校准');
                        }}
                        className="flex flex-col items-center space-y-1.5 outline-none group"
                      >
                        <div className={`h-11 w-11 rounded-full flex items-center justify-center transition-all ${
                          lightsFlashing ? 'bg-zinc-100 ring-2 ring-zinc-900 text-zinc-950' : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-700'
                        }`}>
                          <Sparkles className="w-4 h-4 stroke-[2]" />
                        </div>
                        <span className="text-[9.5px] font-black text-zinc-800">闪灯</span>
                      </button>

                      {/* 5. 胎压 */}
                      <button
                        onClick={() => {
                          setTirePressureShow(!tirePressureShow);
                          showToast(tirePressureShow ? '关闭了前排液晶胎压遥测实时指示图层' : '液晶实时四轮偏磨胎压图层已同步投影');
                        }}
                        className="flex flex-col items-center space-y-1.5 outline-none group"
                      >
                        <div className={`h-11 w-11 rounded-full flex items-center justify-center transition-all ${
                          tirePressureShow ? 'bg-zinc-100 ring-2 ring-zinc-900 text-zinc-950' : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-700'
                        }`}>
                          <Gauge className="w-4 h-4 stroke-[2]" />
                        </div>
                        <span className="text-[9.5px] font-black text-zinc-800">胎压</span>
                      </button>

                    </div>
                  </div>

                  {/* CARD 2: 智能空调 BENTO CARD (Glowing cyber-cyan active indicator on Max Heat) */}
                  <div className="p-4 bg-white rounded-none border border-zinc-200/50 shadow-[0_2px_8px_rgba(0,0,0,0.025)] text-left flex flex-col space-y-3">
                    
                    {/* Header Row */}
                    <div className="flex justify-between items-center">
                      <p className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">智能空调 · SMART CLIMATE</p>
                      
                      <div className="flex items-center space-x-2">
                        {/* Interactive PM2.5 details */}
                        <div className="flex items-center space-x-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                          <span className="w-1 h-1 rounded-full bg-emerald-500" />
                          <span className="text-[8px] font-mono font-black text-emerald-700">空气质量: 优</span>
                        </div>

                        {/* Navigation link jump ＞ */}
                        <button
                          onClick={() => setActiveModal('climate_detail')}
                          className="text-xs font-black text-zinc-900 hover:text-cyan-600 outline-none"
                          title="查看高级香氛与滤網状态"
                        >
                          <span className="font-extrabold text-[#111827]">＞</span>
                        </button>
                      </div>
                    </div>

                    {/* Temperature custom slider controller */}
                    <div className="flex items-center justify-between bg-zinc-50/70 p-2.5 rounded-xl border border-zinc-100/60">
                      <button
                        onClick={() => {
                          setTargetTemp(prev => Math.max(16.0, prev - 0.5));
                          showToast(`🌡️ 调节目标座舱空调恒温至 ${(targetTemp - 0.5).toFixed(1)}°C`);
                        }}
                        className="h-8.5 w-8.5 bg-white border border-zinc-205 text-zinc-800 rounded-full flex items-center justify-center active:scale-95 transition-all outline-none"
                      >
                        <Minus className="w-3.5 h-3.5 stroke-[3]" />
                      </button>

                      <div className="flex flex-col items-center">
                        <span className="text-xl font-black tracking-tight text-zinc-900 flex items-baseline leading-none">
                          {targetTemp.toFixed(1)}
                          <span className="text-xs font-black align-top ml-0.5 text-zinc-800">°C</span>
                        </span>
                        <span className="text-[8px] text-zinc-400 font-bold block mt-1">自动风量平衡 · 无微风避人感</span>
                      </div>

                      <button
                        onClick={() => {
                          setTargetTemp(prev => Math.min(28.0, prev + 0.5));
                          showToast(`🌡️ 调节目标座舱空调恒温至 ${(targetTemp + 0.5).toFixed(1)}°C`);
                        }}
                        className="h-8.5 w-8.5 bg-white border border-zinc-205 text-zinc-800 rounded-full flex items-center justify-center active:scale-95 transition-all outline-none"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      </button>
                    </div>

                    {/* 3 action buttons: 极速升温 Glows Cyber-Cyan by default, 极速降温, 智能等离子除味 */}
                    <div className="grid grid-cols-3 gap-2">
                      
                      {/* Button 1: 极速升温 - DEFAULT STATE: Glowing soft Cyber-Cyan as active/开启中 */}
                      <button
                        onClick={() => adjustClimateMode('heat')}
                        className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all duration-300 relative overflow-hidden ${
                          climateMode === 'heat'
                            ? 'bg-[#E0FDFE] border-[#06B6D4] text-[#083344] shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                            : 'bg-zinc-50 border-zinc-200 text-zinc-800 hover:bg-zinc-100'
                        }`}
                      >
                        {climateMode === 'heat' && (
                          <span className="absolute top-1 right-1 flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-500"></span>
                          </span>
                        )}
                        <Flame className={`w-4 h-4 ${climateMode === 'heat' ? 'text-cyan-500 stroke-[2.5]' : 'text-amber-500'}`} />
                        <span className="text-[10px] font-black mt-1">极速升温</span>
                        {climateMode === 'heat' && <span className="text-[7.5px] font-bold text-cyan-600 block leading-none mt-0.5">运行中</span>}
                      </button>

                      {/* Button 2: 极速降温 */}
                      <button
                        onClick={() => adjustClimateMode('cool')}
                        className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all duration-300 relative ${
                          climateMode === 'cool'
                            ? 'bg-zinc-950 border-zinc-900 text-white shadow-xs'
                            : 'bg-zinc-50 border-zinc-200 text-zinc-800 hover:bg-zinc-100'
                        }`}
                      >
                        <Wind className={`w-4 h-4 ${climateMode === 'cool' ? 'text-white' : 'text-sky-500'}`} />
                        <span className="text-[10px] font-black mt-1">极速降温</span>
                        {climateMode === 'cool' && <span className="text-[7.5px] font-bold text-zinc-400 block leading-none mt-0.5">运行中</span>}
                      </button>

                      {/* Button 3: 等离子除味 */}
                      <button
                        onClick={() => adjustClimateMode('deodorize')}
                        className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all duration-300 relative ${
                          climateMode === 'deodorize'
                            ? 'bg-zinc-950 border-zinc-900 text-white shadow-xs'
                            : 'bg-zinc-50 border-zinc-200 text-zinc-800 hover:bg-zinc-100'
                        }`}
                      >
                        <Sparkles className={`w-4 h-4 ${climateMode === 'deodorize' ? 'text-white' : 'text-emerald-500'}`} />
                        <span className="text-[10px] font-black mt-1">等离子除味</span>
                        {climateMode === 'deodorize' && <span className="text-[7.5px] font-bold text-zinc-400 block leading-none mt-0.5">运行中</span>}
                      </button>

                    </div>
                  </div>

                  {/* CARD 3: 智能泊车 BENTO CARD (APA with vehicle radar micro graphics & progress) */}
                  <div className="p-4 bg-white rounded-none border border-zinc-200/50 shadow-[0_2px_8px_rgba(0,0,0,0.025)] text-left flex flex-col space-y-2.5">
                    
                    {/* Parking Header & Tabs */}
                    <div className="flex justify-between items-center pb-1.5 border-b border-zinc-100">
                      <p className="text-[11px] font-black text-zinc-400 separator-label uppercase tracking-widest">智能泊车 · SMART PARKING</p>
                      
                      {/* Section Tabs inside Parking Card */}
                      <div className="flex bg-zinc-100 p-0.5 rounded-lg border border-zinc-200/50">
                        <button
                          onClick={() => {
                            setSelectedParkingTab('summon');
                            setParkingMessage('超声波雷达已捕捉好防护圈，车主可用长按直线开动移车');
                          }}
                          className={`text-[9.5px] font-black px-2 py-0.5 rounded transition-colors ${
                            selectedParkingTab === 'summon' ? 'bg-white text-zinc-900 shadow-[0_1px_3px_rgba(0,0,0,0.05)]' : 'text-zinc-500'
                          }`}
                        >
                          进出车位
                        </button>
                        <button
                          onClick={() => {
                            setSelectedParkingTab('remote');
                            setParkingMessage('APA自动遥控泊车：车辆将以0.5km/h安全极限速度无感遥泊入库');
                          }}
                          className={`text-[9.5px] font-black px-2 py-0.5 rounded transition-colors ${
                            selectedParkingTab === 'remote' ? 'bg-white text-zinc-900 shadow-[0_1px_3px_rgba(0,0,0,0.05)]' : 'text-zinc-500'
                          }`}
                        >
                          遥控泊车
                        </button>
                      </div>
                    </div>

                    {/* Interactive Live Parking Demo Area */}
                    <div className="bg-zinc-50/70 rounded-xl p-2.5 border border-zinc-100 flex items-center justify-between relative overflow-hidden">
                      <div className="flex-1 text-left pr-3">
                        <span className="text-[8px] font-mono tracking-wider font-extrabold text-cyan-600 block">境行自适应泊车算法已唤醒</span>
                        <p className="text-[10px] font-extrabold text-zinc-700 mt-1 leading-snug">
                          {parkingMessage}
                        </p>
                        
                        {/* Dynamic Progress indicator */}
                        {summonState !== 'idle' && (
                          <div className="mt-2 text-left">
                            <div className="flex justify-between text-[8px] font-black text-zinc-400 mb-1">
                              <span>移控中: {summonProgress}%</span>
                              <span className="text-zinc-700 animate-pulse font-sans">避障雷达正常工作中</span>
                            </div>
                            <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-cyan-500 h-full rounded-full transition-all duration-300" style={{ width: `${summonProgress}%` }}></div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Small Vehicle Radar Graphics inside the Parking Bento Card */}
                      <div className="w-18 h-18 bg-white rounded-lg border border-zinc-200/50 flex flex-col items-center justify-center relative flex-shrink-0 shadow-xs">
                        {/* Safety ray sweeps */}
                        <div className={`absolute inset-0 rounded-lg border border-dotted ${
                          summonState !== 'idle' ? 'border-cyan-400 animate-pulse' : 'border-zinc-250'
                        }`} />
                        <svg className={`w-7 h-11 text-zinc-400 transition-all ${
                          summonState === 'moving_forward' ? '-translate-y-2.5 duration-500' : summonState === 'moving_backward' ? 'translate-y-2.5 duration-500' : ''
                        }`} fill="none" viewBox="0 0 24 36" stroke="currentColor" strokeWidth="2">
                          <rect x="5" y="4" width="14" height="28" rx="4" stroke="currentColor"/>
                          <circle cx="9" cy="10" r="1.5" fill="currentColor"/>
                          <circle cx="15" cy="10" r="1.5" fill="currentColor"/>
                          <rect x="8" y="24" width="8" height="4" rx="1" fill="currentColor"/>
                          <rect x="3" y="8" width="2" height="5" rx="1" fill="currentColor"/>
                          <rect x="19" y="8" width="2" height="5" rx="1" fill="currentColor"/>
                          <rect x="3" y="22" width="2" height="5" rx="1" fill="currentColor"/>
                          <rect x="19" y="22" width="2" height="5" rx="1" fill="currentColor"/>
                        </svg>
                        
                        {/* Direction indicators */}
                        {summonState === 'moving_forward' && (
                          <div className="absolute top-1 text-[8px] text-cyan-500 animate-bounce font-black">▲</div>
                        )}
                        {summonState === 'moving_backward' && (
                          <div className="absolute bottom-1 text-[8px] text-cyan-500 animate-bounce font-black">▼</div>
                        )}
                      </div>
                    </div>

                    {/* Controller Action buttons */}
                    <div className="grid grid-cols-2 gap-2.5">
                      {selectedParkingTab === 'summon' ? (
                        <>
                          <button
                            onClick={() => {
                              if (summonState !== 'idle') {
                                setSummonState('idle');
                                setParkingMessage('高压驱动已安全拦截制动停车');
                              } else {
                                setSummonState('moving_forward');
                                setSummonProgress(0);
                                showToast('◀️ 指令下发：车辆正在极慢速前进驶出 narrow 极窄泊位');
                              }
                            }}
                            className="bg-zinc-950 hover:bg-black text-white font-extrabold text-[10px] py-3.5 rounded-xl active:scale-[0.98] transition-all flex items-center justify-center outline-none"
                          >
                            <span>{summonState === 'moving_forward' ? '停止 (手动拦停)' : '按住 · 车辆前进'}</span>
                          </button>
                          
                          <button
                            onClick={() => {
                              if (summonState !== 'idle') {
                                setSummonState('idle');
                                setParkingMessage('高压驱动已安全拦截制动停车');
                              } else {
                                setSummonState('moving_backward');
                                setSummonProgress(0);
                                showToast('▶️ 指令下发：车辆正在极慢速往后移动退回狭窄泊位');
                              }
                            }}
                            className="bg-white border border-zinc-250 text-zinc-900 font-extrabold text-[10px] py-3.5 rounded-xl active:scale-[0.98] transition-all flex items-center justify-center outline-none"
                          >
                            <span>{summonState === 'moving_backward' ? '停止 (手动拦停)' : '按住 · 车辆后退'}</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setSummonState('auto_parking');
                              setSummonProgress(0);
                              showToast('🅿️ 自动泊入划线车位程序启动中，后轮防抱死卡钳将自动锁离控制');
                            }}
                            className="bg-zinc-950 hover:bg-black text-white font-extrabold text-[10px] py-3.5 rounded-xl active:scale-[0.98] transition-all flex items-center justify-center outline-none col-span-2"
                          >
                            <span>一键开启智能倒车入库</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                </div>

              </motion.div>
            )}

            {/* TAB CONTENT: DISCOVER / CHARGE GRID (发现 PAGE) */}
            {activeTab === 'discover' && (
              <motion.div
                key="discover"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="flex-1 flex flex-col p-4 space-y-4 text-left"
              >
                <div className="flex justify-between items-center text-left">
                  <h2 className="text-base font-black tracking-tight text-zinc-950">快速查找 · 智能出行补能</h2>
                  <span className="text-[10px] text-zinc-400 font-bold">境行 · INJOY 智能互联</span>
                </div>

                {/* Simulated Maps Banner with detailed vector styled landmarks */}
                <div className="relative w-full h-50 rounded-2xl bg-zinc-150 border border-zinc-250 overflow-hidden flex flex-col justify-between p-4 shadow-sm">
                  {/* Mock map roads background pattern */}
                  <div className="absolute inset-0 bg-[radial-gradient(#ccc_1px,transparent_1px)] [background-size:16px_16px] opacity-70 z-0" />
                  <div className="absolute top-[20%] left-0 right-0 h-[2px] bg-zinc-300 transform -rotate-12 z-0" />
                  <div className="absolute top-0 bottom-0 left-[40%] w-[2px] bg-zinc-300 transform rotate-12 z-0" />
                  <div className="absolute top-[65%] left-0 right-0 h-[2px] bg-zinc-300 z-0" />
                  <div className="absolute top-[60%] bottom-0 left-[60%] w-[3px] bg-cyan-500/40 z-0" />
                  
                  {/* Pin landmarks */}
                  <div className="absolute top-[35%] left-[25%] z-10 flex flex-col items-center">
                    <div className="bg-zinc-950 text-white rounded-full p-1.5 shadow-md flex items-center justify-center ring-2 ring-white">
                      <Car className="w-3.5 h-3.5" />
                    </div>
                    <span className="bg-zinc-950 text-white rounded px-1.5 py-0.5 text-[8px] font-black mt-1 uppercase scale-90">我的车 · 当前点</span>
                  </div>

                  <div className="absolute top-[25%] right-[22%] z-10 flex flex-col items-center">
                    <div className="bg-cyan-500 text-white rounded-full p-1.5 shadow-md flex items-center justify-center ring-2 ring-white animate-bounce">
                      <Zap className="w-3.5 h-3.5" />
                    </div>
                    <span className="bg-cyan-500 text-white rounded px-1.5 py-0.5 text-[8px] font-black mt-1 uppercase scale-90">高压超级桩站</span>
                  </div>

                  {/* Header overlay */}
                  <div className="bg-white/95 backdrop-blur-md rounded-xl p-2.5 border border-zinc-200 z-10 w-full flex items-center justify-between">
                    <div>
                      <p className="text-[8px] text-zinc-400 font-black">全球卫星无感差分高精度定位</p>
                      <p className="text-xs font-black text-zinc-800">深圳市高新产业中核心产业园B5停车场</p>
                    </div>
                    <button
                      onClick={() => showToast('🧭 卫星差分坐标图层重新解算对齐')}
                      className="h-8 w-8 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-full flex items-center justify-center"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Bottom overlay for chargers range filters */}
                  <div className="z-10 flex space-x-1.5">
                    <span className="bg-zinc-950 text-white rounded-lg px-2.5 py-1 text-[9px] font-black">
                      科技港快充 1.2km
                    </span>
                    <span className="bg-white border border-zinc-200 text-zinc-800 rounded-lg px-2.5 py-1 text-[9px] font-black">
                      免费合作桩 2.4km
                    </span>
                  </div>
                </div>

                {/* Popular Charging Grid List */}
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-1">智能推送补能网点</span>
                <div className="flex flex-col space-y-2.5">
                  <div className="p-3.5 bg-white border border-zinc-200/50 rounded-2xl flex justify-between items-center">
                    <div className="text-left">
                      <p className="text-xs font-black text-zinc-800">境行高压分布式直流超充网络 № 01</p>
                      <p className="text-[9.5px] text-zinc-400 mt-0.5">空闲超高压液冷枪柱 12 组 · 空调休息室已就位</p>
                    </div>
                    <button
                      onClick={() => showToast('🗺️ 直流超充网络 № 01 导航已推送至行车大屏')}
                      className="px-3 py-1.5 bg-zinc-950 text-white text-[10px] font-black rounded-lg"
                    >
                      导航
                    </button>
                  </div>

                  <div className="p-3.5 bg-white border border-zinc-200/50 rounded-2xl flex justify-between items-center">
                    <div className="text-left">
                      <p className="text-xs font-black text-zinc-800">万象天成高速极速直流桩群</p>
                      <p className="text-[9.5px] text-zinc-400 mt-0.5">空闲 8 柱 | 平均功率 240kW | 商超地下免费免单停</p>
                    </div>
                    <button
                      onClick={() => showToast('🗺️ 万象天成桩群自适应导航已推送')}
                      className="px-3 py-1.5 bg-zinc-950 text-white text-[10px] font-black rounded-lg"
                    >
                      导航
                    </button>
                  </div>
                </div>

              </motion.div>
            )}

            {/* TAB CONTENT: COMMUNITY (车友 PAGE) */}
            {activeTab === 'community' && (
              <motion.div
                key="community"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="flex-1 flex flex-col p-4 space-y-4 text-left"
              >
                <div className="flex justify-between items-center text-left pb-1">
                  <h2 className="text-base font-black tracking-tight text-zinc-950">车友大本营 · 境行社区</h2>
                  <span className="text-[10px] text-zinc-400 font-bold">境行生活联盟</span>
                </div>

                <div className="bg-white border border-zinc-200 p-4 rounded-2xl space-y-4">
                  {/* Owner Post 1 */}
                  <div className="pb-4 border-b border-zinc-150">
                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 rounded-full bg-cyan-100 flex items-center justify-center font-black text-[11px] text-cyan-800">
                        IJ
                      </div>
                      <div>
                        <p className="text-xs font-black text-zinc-850">上海车友 · IN_J99</p>
                        <p className="text-[9px] text-zinc-400">10分钟前 · 境行首批创始车主</p>
                      </div>
                    </div>
                    <p className="text-xs font-bold text-zinc-700 mt-2.5 leading-relaxed">
                      今天提了最新款白色境行INJOY智雅SUV。394km(WLTP)平时上班和周末周边露营开真的极度富余。全车空气自净等离子在梅雨季节真乃神器。
                    </p>
                    <div className="flex items-center space-x-4 mt-3 text-zinc-400">
                      <button onClick={() => showToast('👍 为上海车友点赞')} className="text-[10px] font-black hover:text-black">
                        赞 128
                      </button>
                      <button onClick={() => showToast('💬 车友回复')} className="text-[10px] font-black hover:text-black">
                        评论 42
                      </button>
                    </div>
                  </div>

                  {/* Owner Post 2 */}
                  <div>
                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 rounded-full bg-zinc-900 flex items-center justify-center font-black text-[11px] text-white">
                        极
                      </div>
                      <div>
                        <p className="text-xs font-black text-zinc-850">首测官 · 极地大轮毂</p>
                        <p className="text-[9px] text-zinc-400">2小时前 · 纯电独立算法实验室</p>
                      </div>
                    </div>
                    <p className="text-xs font-bold text-zinc-700 mt-2.5 leading-relaxed">
                      测评实录：境行INJOY 这次的直线召回泊车做得非常干净利落。即使是两侧间隙只有不到20cm的极限狭窄立柱停车，用手机轻轻长按一次就能平贴入库，十分推荐新手车主。
                    </p>
                    <div className="flex items-center space-x-4 mt-3 text-zinc-400">
                      <button onClick={() => showToast('👍 点赞')} className="text-[10px] font-black hover:text-black">
                        赞 425
                      </button>
                      <button onClick={() => showToast('💬 评论')} className="text-[10px] font-black hover:text-black">
                        评论 91
                      </button>
                    </div>
                  </div>
                </div>

              </motion.div>
            )}

            {/* TAB CONTENT: SHOP / EXPLORE (探索 PAGE) */}
            {activeTab === 'shop' && (
              <motion.div
                key="shop"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="flex-1 flex flex-col p-4 space-y-4 text-left"
              >
                <div className="flex justify-between items-center text-left">
                  <h2 className="text-base font-black tracking-tight text-zinc-950">官方无界精选商城</h2>
                  <span className="text-[10px] text-zinc-400 font-bold font-mono">INJOY Boutique</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white border border-zinc-200 p-3 rounded-2xl flex flex-col justify-between">
                    <div className="h-26 bg-zinc-50 rounded-xl mb-2.5 flex items-center justify-center relative">
                      <span className="text-[32px]">🔌</span>
                      <span className="absolute top-2 left-2 bg-zinc-950 text-white text-[8px] font-black px-1.5 py-0.5 rounded">热卖</span>
                    </div>
                    <p className="text-xs font-black text-zinc-800 leading-snug">7kW 智感家用智能双模充电桩 (安全防火款)</p>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-xs font-black text-zinc-900">¥ 2,999</span>
                      <button
                        onClick={() => showToast('🛒 充电桩已加入意愿购单，境行安装对接顾问将在1小时内致电详谈')}
                        className="bg-zinc-950 text-white text-[9.5px] font-black px-2.5 py-1.5 rounded-lg active:scale-95 transition-all"
                      >
                        订购
                      </button>
                    </div>
                  </div>

                  <div className="bg-white border border-zinc-200 p-3 rounded-2xl flex flex-col justify-between">
                    <div className="h-26 bg-zinc-50 rounded-xl mb-2.5 flex items-center justify-center">
                      <span className="text-[32px]">🪐</span>
                    </div>
                    <p className="text-xs font-black text-zinc-800 leading-snug">多维度高压全气压按摩多功能车载定制头枕</p>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-xs font-black text-zinc-900">¥ 489</span>
                      <button
                        onClick={() => showToast('🛒 意愿购头枕已配置进车主专享大礼包车端兑换')}
                        className="bg-zinc-950 text-white text-[9.5px] font-black px-2.5 py-1.5 rounded-lg active:scale-95 transition-all"
                      >
                        订购
                      </button>
                    </div>
                  </div>
                </div>

              </motion.div>
            )}

            {/* TAB CONTENT: PROFILE (我的 PAGE) */}
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="flex-1 flex flex-col p-4 space-y-4 text-left"
              >
                <div className="flex justify-between items-center text-left pb-1">
                  <h2 className="text-base font-black tracking-tight text-zinc-950">车主中心</h2>
                  <span className="text-[10px] text-zinc-400 font-bold">INJOY Security Account</span>
                </div>

                {/* User Info Card */}
                <div className="bg-zinc-900 text-white rounded-2xl p-5 border border-zinc-900 shadow-md flex items-center space-x-3.5">
                  <div className="h-12 w-12 rounded-full bg-cyan-400 text-zinc-950 flex items-center justify-center font-black text-base shadow-inner">
                    IJ
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-black text-white">智纯领航人 · 境行主理</p>
                      <span className="bg-cyan-400 text-zinc-950 text-[7px] font-black px-1.5 py-0.5 rounded">创世</span>
                    </div>
                    <p className="text-[10px] text-zinc-400 mt-1">车牌号码：沪 A·D39919 | 安全数字密匙：已配对</p>
                  </div>
                </div>

                {/* Digital Car Keys */}
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-2">数字钥匙管理</span>
                <div className="bg-white border border-zinc-200/50 rounded-2xl p-4 flex justify-between items-center">
                  <div className="text-left flex items-center space-x-3">
                    <div className="bg-cyan-50 text-cyan-600 rounded-xl p-2 flex items-center justify-center">
                      <Zap className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-zinc-800">车控手机无感蓝牙数字密匙</p>
                      <p className="text-[9.5px] text-emerald-600 font-bold mt-0.5">● 5G 超带宽厘米级极近精准定位联动中</p>
                    </div>
                  </div>
                  <span className="text-[9.5px] bg-zinc-100 text-zinc-800 px-2 py-1 rounded font-black">
                    已激活
                  </span>
                </div>

                {/* Owner vehicle service diagnostics items */}
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-1">绿色低碳权益</span>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white border border-zinc-200 p-4 rounded-xl text-center flex flex-col items-center">
                    <span className="text-2xl mb-1">🛣️</span>
                    <p className="text-[10px] font-black text-zinc-400">里程积累周报</p>
                    <p className="text-sm font-black text-zinc-800 mt-1">240 km</p>
                  </div>
                  <button
                    onClick={() => {
                      showToast('📊 境行低碳减排：您的电驱SUV较传统燃油SUV已累计减少 125.4 kg 碳排放，获得荣誉徽章！');
                    }}
                    className="bg-white border border-zinc-200 p-4 rounded-xl text-center flex flex-col items-center outline-none"
                  >
                    <span className="text-2xl mb-1">🍃</span>
                    <p className="text-[10px] font-black text-zinc-400">累计碳自净化贡献</p>
                    <p className="text-sm font-black text-emerald-600 mt-1">125.4 kg</p>
                  </button>
                </div>

              </motion.div>
            )}

          </AnimatePresence>

        </div>

        {/* BOTTOM NAVIGATION BAR (FIXED BASE RENDER COMPLIANT WITH XPENG & GEELY UI) */}
        <div id="bottom-navigation-bar" className="absolute bottom-0 inset-x-0 h-16 bg-white border-t border-zinc-150 flex justify-around items-center z-50 px-2 shadow-[0_-2px_10px_rgba(0,0,0,0.015)]">
          
          {/* Nav Item 1: 发现 */}
          <button
            onClick={() => setActiveTab('discover')}
            className={`flex flex-col items-center justify-center flex-1 h-full relative outline-none transition-all ${
              activeTab === 'discover' ? 'text-zinc-950 scale-102' : 'text-zinc-400'
            }`}
          >
            <Compass className={`w-5 h-5 ${activeTab === 'discover' ? 'stroke-[2.5] text-zinc-950' : 'stroke-[1.8]'}`} />
            <span className={`text-[9.5px] font-black mt-1 ${activeTab === 'discover' ? 'text-zinc-950' : ''}`}>
              发现
            </span>
          </button>

          {/* Nav Item 2: 车友 */}
          <button
            onClick={() => setActiveTab('community')}
            className={`flex flex-col items-center justify-center flex-1 h-full relative outline-none transition-all ${
              activeTab === 'community' ? 'text-zinc-950 scale-102' : 'text-zinc-400'
            }`}
          >
            <Users className={`w-5 h-5 ${activeTab === 'community' ? 'stroke-[2.5] text-zinc-950' : 'stroke-[1.8]'}`} />
            <span className={`text-[9.5px] font-black mt-1 ${activeTab === 'community' ? 'text-zinc-950' : ''}`}>
              车友
            </span>
          </button>

          {/* Nav Item 3: 车控 (HIGHLIGHTED CURRENTLY TO SIGNIFY CORE APP VIEW) */}
          <button
            onClick={() => setActiveTab('car')}
            className={`flex flex-col items-center justify-center flex-1 h-full relative outline-none transition-all ${
              activeTab === 'car' ? 'text-cyan-600 scale-102' : 'text-zinc-400'
            }`}
          >
            <Car className={`w-5.5 h-5.5 ${activeTab === 'car' ? 'text-[#06B6D4] stroke-[3]' : 'stroke-[1.8]'}`} />
            <span className={`text-[10px] font-black mt-1 ${activeTab === 'car' ? 'text-[#06B6D4]' : ''}`}>
              车控
            </span>
            {activeTab === 'car' && (
              <motion.div
                layoutId="activeTabUnderglow"
                className="absolute bottom-1 h-1 w-5 bg-[#06B6D4] rounded-full"
              />
            )}
          </button>

          {/* Nav Item 4: 探索 */}
          <button
            onClick={() => setActiveTab('shop')}
            className={`flex flex-col items-center justify-center flex-1 h-full relative outline-none transition-all ${
              activeTab === 'shop' ? 'text-zinc-950 scale-102' : 'text-zinc-400'
            }`}
          >
            <ShoppingBag className={`w-5 h-5 ${activeTab === 'shop' ? 'stroke-[2.5] text-zinc-950' : 'stroke-[1.8]'}`} />
            <span className={`text-[9.5px] font-black mt-1 ${activeTab === 'shop' ? 'text-zinc-950' : ''}`}>
              探索
            </span>
          </button>

          {/* Nav Item 5: 我的 */}
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center justify-center flex-1 h-full relative outline-none transition-all ${
              activeTab === 'profile' ? 'text-zinc-950 scale-102' : 'text-zinc-400'
            }`}
          >
            <User className={`w-5 h-5 ${activeTab === 'profile' ? 'stroke-[2.5] text-zinc-950' : 'stroke-[1.8]'}`} />
            <span className={`text-[9.5px] font-black mt-1 ${activeTab === 'profile' ? 'text-zinc-950' : ''}`}>
              我的
            </span>
          </button>

        </div>

      </div>
    </div>
  );
}
