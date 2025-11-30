import { useState, useEffect } from 'react';
import { AlertCircle, Skull, ChevronRight } from 'lucide-react';

interface Question {
  question: string;
  answers: string[];
  correct: number;
}

const ScaryPhysicsQuest = () => {
  const [activeTab, setActiveTab] = useState<'area' | 'volume'>('area');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);

  // Генерация вопросов для площади
  const generateAreaQuestions = () => {
    const conversions = [
      { from: 'см²', to: 'м²', factor: 0.0001 },
      { from: 'м²', to: 'см²', factor: 10000 },
      { from: 'мм²', to: 'см²', factor: 0.01 },
      { from: 'см²', to: 'мм²', factor: 100 },
      { from: 'дм²', to: 'м²', factor: 0.01 },
      { from: 'м²', to: 'дм²', factor: 100 },
      { from: 'км²', to: 'м²', factor: 1000000 },
      { from: 'м²', to: 'км²', factor: 0.000001 },
      { from: 'мм²', to: 'м²', factor: 0.000001 },
      { from: 'м²', to: 'мм²', factor: 1000000 },
    ];

    const qs = [];
    for (let i = 0; i < 15; i++) {
      const conv = conversions[Math.floor(Math.random() * conversions.length)];
      
      // Генерируем числа с максимум 2 значащими цифрами
      let value;
      const type = Math.random();
      if (type < 0.4) {
        // Однозначные: 2, 5, 8
        value = Math.floor(Math.random() * 9) + 1;
      } else if (type < 0.7) {
        // Двузначные: 15, 42, 78
        value = Math.floor(Math.random() * 90) + 10;
      } else {
        // С одним знаком после запятой: 2.5, 4.8, 7.2
        value = (Math.floor(Math.random() * 90) + 10) / 10;
      }
      
      const correctAnswer = value * conv.factor;
      
      const { answers, correctIndex } = generateAnswers(correctAnswer);
      
      qs.push({
        question: `${formatNumber(value)} ${conv.from} бірлігін ${conv.to} бірлігіне аудар`,
        answers: answers,
        correct: correctIndex
      });
    }
    return qs;
  };

  // Генерация вопросов для объема
  const generateVolumeQuestions = () => {
    const conversions = [
      { from: 'мл', to: 'м³', factor: 0.000001 },
      { from: 'м³', to: 'мл', factor: 1000000 },
      { from: 'см³', to: 'м³', factor: 0.000001 },
      { from: 'м³', to: 'см³', factor: 1000000 },
      { from: 'л', to: 'м³', factor: 0.001 },
      { from: 'м³', to: 'л', factor: 1000 },
      { from: 'дм³', to: 'м³', factor: 0.001 },
      { from: 'м³', to: 'дм³', factor: 1000 },
      { from: 'мм³', to: 'см³', factor: 0.001 },
      { from: 'см³', to: 'мм³', factor: 1000 },
    ];

    const qs = [];
    for (let i = 0; i < 15; i++) {
      const conv = conversions[Math.floor(Math.random() * conversions.length)];
      
      // Генерируем числа с максимум 2 значащими цифрами
      let value;
      const type = Math.random();
      if (type < 0.4) {
        // Однозначные: 2, 5, 8
        value = Math.floor(Math.random() * 9) + 1;
      } else if (type < 0.7) {
        // Двузначные: 15, 42, 78
        value = Math.floor(Math.random() * 90) + 10;
      } else {
        // С одним знаком после запятой: 2.5, 4.8, 7.2
        value = (Math.floor(Math.random() * 90) + 10) / 10;
      }
      
      const correctAnswer = value * conv.factor;
      
      const { answers, correctIndex } = generateAnswers(correctAnswer);
      
      qs.push({
        question: `${formatNumber(value)} ${conv.from} бірлігін ${conv.to} бірлігіне аудар`,
        answers: answers,
        correct: correctIndex
      });
    }
    return qs;
  };

  // Генерация вариантов ответов
  const generateAnswers = (correct: number) => {
    // Округляем правильный ответ до значащих цифр
    const roundToSignificant = (num: number, sig = 2) => {
      if (num === 0) return 0;
      const mult = Math.pow(10, sig - Math.floor(Math.log10(Math.abs(num))) - 1);
      return Math.round(num * mult) / mult;
    };
    
    const rounded = roundToSignificant(correct);
    const variants = [
      rounded,
      roundToSignificant(rounded * 10),
      roundToSignificant(rounded * 0.1),
      roundToSignificant(rounded * 100)
    ];
    
    // Перемешиваем ответы
    for (let i = variants.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [variants[i], variants[j]] = [variants[j], variants[i]];
    }
    
    // Находим индекс правильного ответа после перемешивания
    const correctIndex = variants.findIndex(v => v === rounded);
    
    return {
      answers: variants.map(a => formatNumber(a)),
      correctIndex: correctIndex
    };
  };

  // Форматирование чисел
  const formatNumber = (num: number) => {
    if (num >= 1000000 || num <= 0.0001) {
      const exp = Math.floor(Math.log10(Math.abs(num)));
      const mantissa = num / Math.pow(10, exp);
      const superscript = (n: number) => {
        const chars: { [key: string]: string } = {'-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹'};
        return n.toString().split('').map(c => chars[c] || c).join('');
      };
      return `${mantissa.toFixed(1).replace('.', ',')}×10${superscript(exp)}`;
    }
    return num.toString().replace('.', ',');
  };

  // Инициализация вопросов
  useEffect(() => {
    if (activeTab === 'area') {
      setQuestions(generateAreaQuestions());
    } else {
      setQuestions(generateVolumeQuestions());
    }
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
  }, [activeTab]);

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(index);
    if (index === questions[currentQuestion].correct) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
    }
  };

  const handleRestart = () => {
    if (activeTab === 'area') {
      setQuestions(generateAreaQuestions());
    } else {
      setQuestions(generateVolumeQuestions());
    }
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  if (questions.length === 0) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-black text-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" style={{fontFamily: 'Georgia, serif'}}>
            ⚠️ ӨЛШЕМ БІРЛІКТЕРІНІҢ ЗЫНДАНЫ ⚠️
          </h1>
          <p className="text-xl text-gray-300 italic">Сен бұл сынақтардан аман шыға аласың ба?</p>
        </div>

        {/* Вкладки */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('area')}
            className={`flex-1 py-4 px-6 rounded-lg font-bold text-lg transition-all ${
              activeTab === 'area'
                ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.6)]'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            🏚️ АУДАНДАР БӨЛМЕСІ
          </button>
          <button
            onClick={() => setActiveTab('volume')}
            className={`flex-1 py-4 px-6 rounded-lg font-bold text-lg transition-all ${
              activeTab === 'volume'
                ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.6)]'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            🕳️ КӨЛЕМДЕР ЗЫНДАНЫ
          </button>
        </div>

        {!showResult ? (
          <div className="bg-gray-800 rounded-lg p-8 shadow-2xl border-2 border-red-900">
            {/* Счетчик */}
            <div className="flex justify-between items-center mb-6 text-sm">
              <div className="flex items-center gap-2">
                <Skull className="text-red-500" size={20} />
                <span className="text-gray-400">Сынақ {currentQuestion + 1} / 15</span>
              </div>
              <div className="text-green-400 font-bold">
                ✓ Аман қалды: {score}
              </div>
            </div>

            {/* Вопрос */}
            <div className="mb-8">
              <div className="bg-black/50 p-6 rounded-lg border border-red-800 mb-6">
                <p className="text-2xl text-center text-red-300 font-bold">
                  {questions[currentQuestion].question}
                </p>
              </div>

              {/* Варианты ответов */}
              <div className="grid grid-cols-2 gap-4">
                {questions[currentQuestion].answers.map((answer: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={selectedAnswer !== null}
                    className={`p-6 rounded-lg font-bold text-xl transition-all ${
                      selectedAnswer === null
                        ? 'bg-gray-700 hover:bg-gray-600 text-white border-2 border-gray-600'
                        : index === questions[currentQuestion].correct
                        ? 'bg-green-600 text-white border-2 border-green-400 shadow-[0_0_20px_rgba(34,197,94,0.6)]'
                        : selectedAnswer === index
                        ? 'bg-red-600 text-white border-2 border-red-400 shadow-[0_0_20px_rgba(220,38,38,0.6)]'
                        : 'bg-gray-700 text-gray-500 border-2 border-gray-600'
                    }`}
                  >
                    {answer}
                  </button>
                ))}
              </div>
            </div>

            {/* Сообщение и кнопка */}
            {selectedAnswer !== null && (
              <div className="space-y-4">
                <div className={`p-4 rounded-lg text-center font-bold text-lg ${
                  selectedAnswer === questions[currentQuestion].correct
                    ? 'bg-green-900/50 text-green-300 border border-green-600'
                    : 'bg-red-900/50 text-red-300 border border-red-600'
                }`}>
                  {selectedAnswer === questions[currentQuestion].correct
                    ? '✓ ДҰРЫС! Сен бұл сынақтан аман шықтың...'
                    : '✗ ҚАТЕ! Келесі сынаққа өтпес бұрын дұрыс жауапты зерттеп ал...'}
                </div>
                
                <button
                  onClick={handleNext}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-lg flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(147,51,234,0.5)]"
                >
                  {currentQuestion < questions.length - 1 ? (
                    <>
                      КЕЛЕСІ СЫНАҚ <ChevronRight />
                    </>
                  ) : (
                    <>
                      ТАҒДЫРДЫ БІЛУ <AlertCircle />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-8 shadow-2xl border-2 border-red-900 text-center">
            <h2 className="text-4xl font-bold mb-6 text-red-400">
              {score >= 12 ? '👑 СЕН АМАН ҚАЛДЫҢ!' : score >= 8 ? '💀 ЕҢ БОЛМАҒАНДА АМАН ҚАЛДЫҢ...' : '☠️ ЗЫНДАНДА ҚАЗА ТАПТЫ'}
            </h2>
            <p className="text-6xl font-bold mb-4 text-yellow-400">
              {score} / 15
            </p>
            <p className="text-xl text-gray-300 mb-8">
              {score >= 12
                ? 'Сен шынайы батырсың! Өлшем бірліктері саған бағынды.'
                : score >= 8
                ? 'Жаман емес, бірақ саған көбірек жаттығу керек...'
                : 'Зындан сені жұтып алды. Қайтадан көріңіз!'}
            </p>
            <button
              onClick={handleRestart}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-all shadow-[0_0_20px_rgba(220,38,38,0.6)]"
            >
              🔄 ҚАЙТАДАН ӨТУ
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScaryPhysicsQuest;