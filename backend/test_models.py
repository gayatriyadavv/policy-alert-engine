import google.generativeai as genai

genai.configure(api_key="AIzaSyAj4r5KdCyrBDKJW6AYYrMhNfrIGvQDP9M")

for m in genai.list_models():
    print(m.name)
