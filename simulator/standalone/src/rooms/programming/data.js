// Programming Lab - Question Data
// 3 languages, 3 difficulty levels, 10 questions per level.

(function () {
  "use strict";

  window.ProgrammingRoom = window.ProgrammingRoom || {};

  const questionBank = {
    python: {
      easy: [
        ["print(____)", ["'Hello World'", "echo", "cout"], 0],
        ["name = ____", ["int", "'Alice'", "print"], 1],
        ["age = 20\nprint(____)", ["age", "'age'", "int"], 0],
        ["x = 5\n____(x)", ["input", "print", "return"], 1],
        ["numbers = [1, 2, 3]\nprint(numbers[____])", ["0", "3", "5"], 0],
        ["if x > 0____", [";", ":", "{}"], 1],
        ["for i ____ range(5):", ["of", "in", "from"], 1],
        ["def greet()____", [";", ":", "{"], 1],
        ["text = 'Python'\nprint(____(text))", ["len", "size", "count"], 0],
        ["is_ready = ____", ["true", "True", "TRUE"], 1]
      ],

      medium: [
        ["for i in range(____):\n    print(i)", ["5", "'5'", "True"], 0],
        ["numbers.append(____)", ["4", "push", "add"], 0],
        ["def add(a, b):\n    ____ a + b", ["print", "return", "break"], 1],
        ["if x == 10:\n    print(____)", ["'Ten'", "Ten", "=="], 0],
        ["items = [2, 4, 6]\nprint(____(items))", ["sum", "total", "add"], 0],
        ["try:\n    x = int(text)\n____ ValueError:", ["catch", "except", "error"], 1],
        ["for key, value in data.____():", ["pairs", "entries", "items"], 2],
        ["result = [x * 2 ____ x in numbers]", ["for", "while", "if"], 0],
        ["def square(n):\n    return n ____ 2", ["^^", "**", "//"], 1],
        ["text = 'hello'\nprint(text.____())", ["upper", "uppercase", "toUpperCase"], 0]
      ],

      hard: [
        ["values = [1, 2, 3]\nresult = list(____(lambda x: x * 2, values))", ["map", "filter", "reduce"], 0],
        ["result = [x for x in range(10) ____ x % 2 == 0]", ["when", "if", "where"], 1],
        ["with open('data.txt') ____ file:", ["as", "is", "in"], 0],
        ["class Person:\n    def __init__(____, name):", ["this", "self", "cls"], 1],
        ["def add(*____):\n    return sum(numbers)", ["numbers", "args[]", "values="], 0],
        ["items = sorted(data, ____=lambda x: x['age'])", ["sort", "key", "by"], 1],
        ["result = {x: x*x ____ x in range(5)}", ["for", "in", "if"], 0],
        ["async def load():\n    result = ____ fetch_data()", ["yield", "await", "return"], 1],
        ["from collections import ____\ncounts = Counter(items)", ["Counter", "count", "Collection"], 0],
        ["numbers = [1, 2, 3]\na, *middle, c = ____", ["numbers", "range", "middle"], 0]
      ]
    },

    java: {
      easy: [
        ['System.out.____("Hello World");', ["printline", "println", "echo"], 1],
        ["int age = ____;", ["20", "'20'", "true"], 0],
        ['String name = ____;', ['"Alice"', "Alice", "'A'"], 0],
        ["boolean active = ____;", ["True", "true", "TRUE"], 1],
        ["int x = 5____", [":", ";", ","], 1],
        ["____ x = 3.14;", ["double", "int", "boolean"], 0],
        ["if (x > 0) ____", ["{", ":", "then"], 0],
        ["for (int i = 0; i < 5; i____)", ["++", "--", "=="], 0],
        ["int[] nums = {1, 2, 3};\nSystem.out.println(nums[____]);", ["0", "3", "4"], 0],
        ["public static void ____(String[] args)", ["start", "main", "run"], 1]
      ],

      medium: [
        ["for (int i = 0; i ____ 10; i++)", ["<", "=>", "==="], 0],
        ['String text = "Java";\nint n = text.____();', ["size", "length", "length()"], 2],
        ["ArrayList<String> names = new ____<>();", ["ArrayList", "Array", "ListArray"], 0],
        ['names.____("Ann");', ["push", "add", "append"], 1],
        ["public int add(int a, int b) {\n    ____ a + b;\n}", ["return", "break", "continue"], 0],
        ["try {\n    run();\n} ____ (Exception e) {}", ["except", "catch", "error"], 1],
        ["switch (day) {\n    ____ 1: break;\n}", ["when", "case", "if"], 1],
        ["int[] arr = {1, 2};\nint size = arr.____;", ["length", "size()", "count"], 0],
        ["for (String item ____ items) {}", [":", "in", "of"], 0],
        ["String value = String.____(123);", ["convert", "valueOf", "toString"], 1]
      ],

      hard: [
        ["List<Integer> nums = Arrays.____(1, 2, 3);", ["asList", "list", "ofArray"], 0],
        ["numbers.stream().____(x -> x * 2)", ["map", "filter", "sort"], 0],
        ["class Dog ____ Animal {}", ["implements", "extends", "inherits"], 1],
        ["class Worker ____ Runnable {}", ["extends", "implements", "uses"], 1],
        ["Map<String, Integer> scores = new ____<>();", ["HashMap", "HashSet", "ArrayList"], 0],
        ["Optional<String> name = Optional.____('A');", ["of", "some", "wrap"], 0],
        ["try (FileReader reader = new FileReader(path)) {\n    // ...\n} ____ (IOException e) {}", ["except", "catch", "finally"], 1],
        ["Collections.____(numbers);", ["sort", "sorted", "order"], 0],
        ["public <T> T identity(T value) {\n    ____ value;\n}", ["yield", "return", "throw"], 1],
        ["CompletableFuture.____(() -> loadData())", ["supplyAsync", "async", "runLater"], 0]
      ]
    },

    cpp: {
      easy: [
        ['std::____ << "Hello World";', ["cin", "cout", "print"], 1],
        ["int age = ____;", ["20", '"20"', "true"], 0],
        ["____ price = 3.5;", ["double", "int", "bool"], 0],
        ["bool active = ____;", ["True", "true", "TRUE"], 1],
        ["int x = 10____", [":", ";", "."], 1],
        ["if (x > 0) ____", ["{", "then", ":"], 0],
        ["for (int i = 0; i < 5; i____)", ["++", "--", "=="], 0],
        ["std::____ >> age;", ["cout", "cin", "read"], 1],
        ["int nums[3] = {1, 2, 3};\nstd::cout << nums[____];", ["0", "3", "4"], 0],
        ["int main() {\n    return ____;\n}", ["0", "void", "main"], 0]
      ],

      medium: [
        ["#include <____>", ["iostream", "console", "print"], 0],
        ["std::string name = ____;", ['"Alex"', "'Alex'", "Alex"], 0],
        ["std::vector<int> nums;\nnums.____(5);", ["append", "push_back", "add"], 1],
        ["int add(int a, int b) {\n    ____ a + b;\n}", ["return", "break", "yield"], 0],
        ["for (int i = 0; i ____ 10; i++)", ["<", "=>", "==="], 0],
        ["std::vector<int> nums = {1, 2};\nstd::cout << nums.____();", ["length", "size", "count"], 1],
        ["int x = 5;\nint* ptr = ____;", ["&x", "*x", "x"], 0],
        ["class Car {\n____:\n    void start();\n};", ["public", "open", "global"], 0],
        ["std::string s = 'abc';\n// Fix the quotes: ____", ['"abc"', "'abc'", "`abc`"], 0],
        ["int a = 10;\nint b = 3;\nint result = a ____ b;", ["%", "//", "**"], 0]
      ],

      hard: [
        ["auto ptr = std::____<Player>();", ["make_unique", "new_unique", "unique"], 0],
        ["std::vector<int> nums;\nstd::____(nums.begin(), nums.end());", ["sort", "order", "sorted"], 0],
        ["template <____ T>\nT add(T a, T b) { return a + b; }", ["typename", "type", "generic"], 0],
        ["auto fn = [](int x) { ____ x * 2; };", ["return", "yield", "break"], 0],
        ["std::move(value) converts value to an ____", ["lvalue", "xvalue", "integer"], 1],
        ["std::unique_ptr<int> p = std::make_unique<int>(5);\nint n = ____;", ["*p", "&p", "p"], 0],
        ["class Base {\npublic:\n    ____ void run() {}\n};", ["virtual", "static", "final"], 0],
        ["std::vector<int> nums = {1, 2, 3};\nfor (auto& n ____ nums) {}", [":", "in", "of"], 0],
        ["std::mutex mutex;\nstd::lock_guard<std::mutex> lock(____);", ["mutex", "&mutex", "*mutex"], 0],
        ["auto result = std::____(values.begin(), values.end(), 0);", ["accumulate", "reduceAll", "sum"], 0]
      ]
    }
  };

  // Convert the compact question data to game-ready objects.
  const questions = {};

  Object.keys(questionBank).forEach(function (language) {
    questions[language] = {};

    Object.keys(questionBank[language]).forEach(function (level) {
      questions[language][level] = questionBank[language][level].map(
        function (item, index) {
          return {
            id: language + "-" + level + "-" + (index + 1),
            code: item[0],
            options: item[1].slice(),
            answer: item[2]
          };
        }
      );
    });
  });

  window.ProgrammingRoom.Data = {
    title: "Programming Lab",
    languages: [
      { id: "python", label: "Python" },
      { id: "java", label: "Java" },
      { id: "cpp", label: "C++" }
    ],
    difficulties: [
      { id: "easy", label: "ง่าย" },
      { id: "medium", label: "ปานกลาง" },
      { id: "hard", label: "ยาก" }
    ],
    questionsPerGame: 10,
    pointsPerQuestion: 10,
    questions: questions
  };
})();