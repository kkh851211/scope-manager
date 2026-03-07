'use client';

import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import { useTheme } from 'next-themes';

export function FAQ() {
  const { theme } = useTheme();

  const faqs = [
    {
      question: "기존 Jira, Notion과 어떻게 다른가요?",
      answer: "Jira·Notion은 작업 관리 도구입니다. Scope Manager는 범위 초과 판정과 청구 근거 생성에 특화된 PM 전용 도구입니다."
    },
    {
      question: "클라이언트가 시스템 판정 결과에 반발하지 않을까요?",
      answer: "PM 개인 의견이 아닌 시스템의 객관적 데이터이기 때문에, 협상 구조 자체가 바뀝니다."
    },
    {
      question: "베타 이후 가격은 어떻게 되나요?",
      answer: "정식 출시 전 얼리 액세스 사용자에게 우선적으로 별도 안내드립니다."
    }
  ];

  return (
    <section id="faq" className={`py-16 sm:py-20 px-5 sm:px-7 ${theme === 'dark' ? 'bg-[#0F1117]' : 'bg-white'
      }`}>
      <div className="max-w-[800px] mx-auto">
        <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-12 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
          자주 묻는 질문
        </h2>

        <Accordion.Root type="single" collapsible className="space-y-3 sm:space-y-4">
          {faqs.map((faq, index) => (
            <Accordion.Item
              key={index}
              value={`item-${index}`}
              className={`border rounded-xl overflow-hidden ${theme === 'dark'
                ? 'bg-[#1A1F2E] border-[#232B3E]'
                : 'bg-gray-50 border-gray-200'
                }`}
            >
              <Accordion.Header>
                <Accordion.Trigger className={`w-full flex items-center justify-between p-4 sm:p-6 text-left transition-colors group ${theme === 'dark'
                  ? 'hover:bg-[#232B3E]/30'
                  : 'hover:bg-gray-100'
                  }`}>
                  <span className={`font-semibold text-base sm:text-lg pr-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                    {faq.question}
                  </span>
                  <ChevronDown
                    size={20}
                    className={`sm:w-6 sm:h-6 transition-transform duration-300 group-data-[state=open]:rotate-180 flex-shrink-0 ${theme === 'dark' ? 'text-[#8C95AA]' : 'text-gray-400'
                      }`}
                  />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                <div className={`px-4 sm:px-6 pb-4 sm:pb-6 leading-relaxed text-sm sm:text-base ${theme === 'dark' ? 'text-[#8C95AA]' : 'text-gray-600'
                  }`}>
                  {faq.answer}
                </div>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </section>
  );
}