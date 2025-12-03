import React from 'react';
import { X, FileText, Gift, MessageSquare, Truck } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const steps = [
    { icon: <Gift className="text-brand-500" size={24} />, title: "1. 免费申领", desc: "浏览商品，点击申领。每个账号每月限领 3 次。" },
    { icon: <Truck className="text-blue-500" size={24} />, title: "2. 坐等收货", desc: "审核通过后，我们将在 48 小时内为您包邮发出。" },
    { icon: <FileText className="text-purple-500" size={24} />, title: "3. 细致品鉴", desc: "收到货品后，请从色、香、味等多维度进行品鉴。" },
    { icon: <MessageSquare className="text-green-500" size={24} />, title: "4. 提交报告", desc: "收货 7 天内需提交 50 字以上真实图文测评。" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-in">
        <div className="bg-brand-50 p-6 flex justify-between items-center border-b border-brand-100">
          <h2 className="text-xl font-bold text-brand-900">试吃规则中心</h2>
          <button onClick={onClose} className="p-1 hover:bg-brand-100 rounded-full transition-colors text-brand-700">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-8">
          <div className="grid gap-6">
            {steps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="bg-gray-50 p-3 rounded-xl flex-shrink-0 shadow-sm">
                  {step.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg mb-1">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-100 text-yellow-800 text-xs leading-relaxed">
            <strong>注意：</strong> 如未按时提交测评报告，将影响后续申领资格（信誉分扣减）。让我们共同维护良好的试吃社区环境。
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 flex justify-end">
          <button 
            onClick={onClose}
            className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
          >
            我知道了
          </button>
        </div>
      </div>
    </div>
  );
};