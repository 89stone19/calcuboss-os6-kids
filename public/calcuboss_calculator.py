# 🧪 Python Calculator by Demki - Calcuboss OS6 Final (Grade 8-12)
print("=== 🇿🇦 CALCUBOSS PYTHON CALCULATOR ===")

while True:
    try:
        num1 = float(input("First number (or 'q' to quit): "))
        op = input("Operation (+, -, *, /): ")
        num2 = float(input("Second number: "))

        if op == "+":
            result = num1 + num2
        elif op == "-":
            result = num1 - num2
        elif op == "*":
            result = num1 * num2
        elif op == "/":
            if num2 == 0:
                print("⚠️ Error: Cannot divide by zero! Check 4-space indent!")
                continue
            result = num1 / num2
        else:
            print("Invalid operator! Use + - * /")
            continue

        print(f"Result: {num1} {op} {num2} = {result} ✅")
    
    except ValueError:
        print("⚠️ Input error: Type numbers only! Verify int() vs float() vs str()")
        print("**3 Steps to Debug:** 1. Check line number 2. Verify int()/float() 3. Check 4-space indent!")
        break
