# # 56.
# a= input("Nhap so: ")

# if a == a[::-1]:
#     print("So doi xung")
# else:
#     print("So khong doi xung")


# #57 convert F to C 
# def converts(a):
#     return round((a-32)*(5/9),2)

# print(converts(90))

# #59 Count number of each char
# char= "abbbbbcdddaaabcccccrrrwwwwaaaa"
# print(len(char))


# # 60 Tìm từ giống nhau nhưng bị đảo lộn thứ tự 
# String = "wew the quite saw was emty" 
# data= String.split(" ")

# for i in range(len(data)): 
#     for j in range(i+1, len(data)):
#         if sorted(data[i]) == sorted(data[j]):
#             print(data[i])
#             print(data[j])


# #61 array that contains common item 
# a1 = {0,1,2,3,2,1,6}; 
# a2 = {1,2,3}; 

# a3= a1 & a2
# print(a3)

# #62  number of prime numbers less than a non-negative number, n.
# a = int(input("Nhập một số: "))
# k = []

# for i in range(0, a):
#     if a == 1:
#         print("Type again")
#     else:
#         if i == 2 or i == 3:
#             k.append(i)
#         elif i % 2 == 0 or i % 3 == 0 or i % 5 == 0 or i % 8 ==0: 
#             pass
#         else:
#             k.append(i)
# print(len(k))

# #63
# nums = [2,7,11,15,1,8]
# target = 9 
# output= []
# for i in range(len(nums)):
#     for j in range(i+1, len(nums)):
#         if nums[i] + nums[j] == target:
#             output.append([i,j])

# print(output)

# # 64 find the length of the longest substring without repeating characters
# s = "abcda"
# seen = set()
# left= 0
# max_len= 0

# # Dùng hai cửa sổ left và right, trong đó left để xoá kí tự đầu chuỗi, right dùng để di chuyển từ trái sang phải
# for right in range(len(s)):
#     while s[right] in seen: 
#         seen.remove(s[left])
#         left+=1
#     seen.add(s[right])
#     max_len= max(max_len, right-left+1)

# print(max_len)

# # Tìm tổng số lớn nhất của k phần tử liên tiếp 
# nums = [1, 3, 2, 6, -1, 4, 1, 8, 2] 
# k = 5
# Output: 18  # [2, 6, -1, 4, 1] hoặc [4, 1, 8, 2]

# if len(nums) < k:
#     pass

# max_sum= 0
# for i in range(len(nums)):
#     windows= nums[i:i+k]
#     current_sum= sum(windows)

#     max_sum= max(current_sum, max_sum)

# print(max_sum)

# # Độ dài chuỗi lớn nhất có tổng ≤ k
# nums = [1, 2, 2, 1, 1, 1, 1,0,0]
# k = 5
# left= 0
# currentSum= 0
# max_length= 0
# target= []
# for right in range(len(nums)):
#     currentSum+= nums[right]

#     while currentSum > k:
#         currentSum-= nums[left]
#         left +=1
#     max_length= max(right-left+1, max_length)


# print(max_length)

# Cắt chuỗi không có kí tự lặp 
# s = "abcabcbb"
# char= ''
# target= []
# for i in s:
#     if i not in char:
#         char += i
#     else: 
#         target.append(char)
#         cutIndex= char.index(i)
#         char= char[cutIndex+1:] + i
# target.append(char)
# print(target)


# # Tính tổng k số liên tiếp
# nums = [2, 1, 5, 1, 3, 2]
# k = 3
# current= 0
# total = []
# for i in range(len(nums)-k+1):
#     windowSum = sum(nums[i:i+k])
#     total.append(windowSum)
# print(total)

# s = "havefunonleetcode"
# k = 5
# # Số lượng chuỗi con có độ dài bằng k, không có kí tự lặp lại 

# #1 lấy các chuỗi con có độ dài bằng k và cho nó vào 1 list 
# current= ''
# result= []
# for i in range(len(s)-k):
#     current += s[i:k+i]
#     result.append(current)
#     current = ''

# #2 Không có kí tự lặp lại 
# result= [value for value in result if len(set(value))== len(value)]
# print(result)

# nums = [1, 2, 1, 0, 1, 1, 0]
# target = 4
# # Chuỗi có tổng bằng 4
# total= 0
# left= 0
# result=[]
# for right in range(len(nums)):
#     total+= nums[right]

#     while total > target and left <= right:
#         total -= nums[left]
#         left +=1

#     if total == target:
#         result.append(nums[left:right+1])
# print(result)

# # Tổng lớn nhất của K số liên tiếp
# nums = [2, 1, 5, 1, 3, 2]
# k = 3
# result= []
# # tạo thành 1 list chứa liên tiếp 3 phần từ trong nums
# for i in range(len(nums)-k+1):
#     windows= nums[i:i+k]
#     result.append(windows)
# max=0
# for i in result:
#     total = sum(i)
#     if total > max:
#         max= total
# print(max)

# nums = [1, 2, 1, 0, 1, 1, 0]
# target = 4
# result= []
# left= 0
# total = 0
# # Dãy có tổng đúng bằng target 
# for right in range(len(nums)):
#     total += nums[right]

#     while total > 4 and left <= right:
#         total -= nums[left]
#         left +=1
#     if total == target:
#         result.append(nums[left:right+1])

# print(result)

nums = [2, 1, 5, 1, 3, 2]
k = 3
result= []
# Dãy có độ dài = k có tổng lớn nhất 
for i in range(len(nums)-k+1):
    result.append(nums[i:i+k])

# Tính tổng lớn nhất
max= 0
for i in result:
    total = sum(i)
    if total > max:
        max= total 

print(max)
