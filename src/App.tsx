import React, { useState, useEffect } from 'react';
import { Users, UserPlus, RotateCcw, Trash2, Check, X, Settings, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Student {
  id: string;
  name: string;
  number: string;
}

export default function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [isEditMode, setIsEditMode] = useState(false);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');

  // 1. 초기 데이터 로드 (로컬 저장소 사용)
  useEffect(() => {
    const savedStudents = localStorage.getItem('trip_students');
    const savedChecked = localStorage.getItem('trip_checked');
    
    if (savedStudents) setStudents(JSON.parse(savedStudents));
    if (savedChecked) setCheckedIds(new Set(JSON.parse(savedChecked)));
  }, []);

  // 2. 상태 변경 시 로컬 저장소에 저장
  useEffect(() => {
    localStorage.setItem('trip_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('trip_checked', JSON.stringify(Array.from(checkedIds)));
  }, [checkedIds]);

  // 학생 추가
  const addStudent = () => {
    if (!newName.trim()) return;
    const newStudent: Student = {
      id: Date.now().toString(),
      name: newName.trim(),
      number: newNumber || (students.length + 1).toString()
    };
    setStudents([...students, newStudent].sort((a, b) => Number(a.number) - Number(b.number)));
    setNewName('');
    setNewNumber('');
  };

  // 학생 삭제
  const removeStudent = (id: string) => {
    setStudents(students.filter(s => s.id !== id));
    const newChecked = new Set(checkedIds);
    newChecked.delete(id);
    setCheckedIds(newChecked);
  };

  // 출석 체크 토글
  const toggleCheck = (id: string) => {
    const newChecked = new Set(checkedIds);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setCheckedIds(newChecked);
  };

  // 전체 초기화
  const resetAll = () => {
    if (confirm('모든 체크 상태를 초기화하고 처음부터 다시 확인하시겠습니까?')) {
      setCheckedIds(new Set());
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans select-none">
      {/* 상단 헤더 */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-20 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-black text-black tracking-tight">체험학습 점검</h1>
          <span className="bg-orange-100 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
            {checkedIds.size} / {students.length}
          </span>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => setIsEditMode(!isEditMode)}
            className={`p-2 rounded-full transition-colors ${isEditMode ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {isEditMode ? <Check size={20} /> : <Settings size={20} />}
          </button>
          {!isEditMode && (
            <button 
              onClick={resetAll}
              className="p-2 bg-red-50 text-red-500 rounded-full hover:bg-red-100 transition-colors"
            >
              <RotateCcw size={20} />
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 p-4">
        <AnimatePresence mode="wait">
          {isEditMode ? (
            /* --- 학생 명단 관리 모드 --- */
            <motion.div 
              key="edit"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 max-w-lg mx-auto"
            >
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                <h3 className="font-bold flex items-center gap-2"><UserPlus size={18}/> 학생 추가</h3>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    placeholder="번호" 
                    value={newNumber}
                    onChange={e => setNewNumber(e.target.value)}
                    className="w-20 p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black"
                  />
                  <input 
                    type="text" 
                    placeholder="이름" 
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    className="flex-1 p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black"
                    onKeyDown={e => e.key === 'Enter' && addStudent()}
                  />
                  <button onClick={addStudent} className="bg-black text-white px-6 rounded-xl font-bold">추가</button>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                  <span className="font-bold text-sm">명단 ({students.length}명)</span>
                </div>
                <div className="divide-y divide-gray-50 max-h-[50vh] overflow-y-auto">
                  {students.map(s => (
                    <div key={s.id} className="px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-gray-400 font-bold">{s.number.padStart(2, '0')}</span>
                        <span className="font-bold">{s.name}</span>
                      </div>
                      <button onClick={() => removeStudent(s.id)} className="text-gray-300 hover:text-red-500 p-2">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                  {students.length === 0 && (
                    <div className="p-12 text-center text-gray-400 text-sm">등록된 학생이 없습니다.</div>
                  )}
                </div>
              </div>
              
              <button 
                onClick={() => setIsEditMode(false)}
                className="w-full py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold flex items-center justify-center gap-2"
              >
                <ChevronLeft size={20} /> 점검 화면으로 돌아가기
              </button>
            </motion.div>
          ) : (
            /* --- 실제 출석 점검 그리드 모드 --- */
            <motion.div 
              key="grid"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3"
            >
              {students.map((student) => {
                const isChecked = checkedIds.has(student.id);
                return (
                  <motion.button
                    key={student.id}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleCheck(student.id)}
                    className={`aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 transition-all border-2 shadow-sm ${
                      isChecked 
                        ? 'bg-green-500 border-green-600 text-white shadow-green-200' 
                        : 'bg-white border-gray-100 text-gray-800'
                    }`}
                  >
                    <span className={`text-[10px] font-bold ${isChecked ? 'text-green-100' : 'text-gray-400'}`}>
                      {student.number}
                    </span>
                    <span className="text-lg font-black tracking-tighter">
                      {student.name}
                    </span>
                    <div className={`mt-1 rounded-full p-0.5 ${isChecked ? 'bg-white text-green-600' : 'bg-gray-50 text-transparent'}`}>
                      <Check size={12} strokeWidth={4} />
                    </div>
                  </motion.button>
                );
              })}
              
              {students.length === 0 && (
                <div className="col-span-full py-20 text-center space-y-4">
                  <div className="flex justify-center text-gray-200"><Users size={80} /></div>
                  <p className="text-gray-400">오른쪽 상단 설정 버튼(<Settings size={16} className="inline"/>)을 눌러<br/>학생 명단을 먼저 등록해 주세요.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 하단 점검 상태 바 */}
      {!isEditMode && students.length > 0 && (
        <div className="p-4 bg-white border-t border-gray-200 shadow-lg sticky bottom-0">
          <div className="max-w-md mx-auto flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-400 uppercase">현재 점검 상태</span>
              <span className="text-lg font-black">
                {checkedIds.size === students.length ? (
                  <span className="text-green-600 flex items-center gap-1">모두 확인됨! <Check size={20}/></span>
                ) : (
                  <span>{students.length - checkedIds.size}명 미확인</span>
                )}
              </span>
            </div>
            <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center font-black text-sm ${
              checkedIds.size === students.length ? 'border-green-500 text-green-500' : 'border-gray-100 text-gray-300'
            }`}>
              {Math.round((checkedIds.size / students.length) * 100) || 0}%
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
