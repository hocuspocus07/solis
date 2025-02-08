#!/usr/bin/env python
# coding: utf-8

# In[1]:


import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import confusion_matrix, accuracy_score, precision_score, recall_score, classification_report
import re, string


# In[44]:


# Load data
file_path = "fake reviews dataset.csv"
data = pd.read_csv(file_path)

# Filter data
df = data

# Encode labels
encoded_label_dict = {"CG": 0, "OR": 1}
df["target"] = df["label"].apply(lambda x: encoded_label_dict.get(x, -1))

# Train-test split
train, test = train_test_split(df, test_size=0.2, shuffle=True, random_state=2021)

# Fill missing text
COMMENT = 'text_'
train[COMMENT] = train[COMMENT].fillna("unknown")
test[COMMENT] = test[COMMENT].fillna("unknown")


# In[32]:


df.head()


# In[34]:


# Tokenizer function
re_tok = re.compile(f'([{string.punctuation}“”¨«»®´·º½¾¿¡§£₤‘’])')
def tokenize(s): return re_tok.sub(r' \1 ', s).split()

# TF-IDF Vectorization
vec = TfidfVectorizer(ngram_range=(1, 2), tokenizer=tokenize,
                      min_df=3, max_df=0.9, strip_accents='unicode', use_idf=True,
                      smooth_idf=True, sublinear_tf=True)

trn_term_doc = vec.fit_transform(train[COMMENT])
test_term_doc = vec.transform(test[COMMENT])

# Logistic Regression with custom preprocessing
def pr(y_i, y):
    p = x[y == y_i].sum(0)
    return (p + 1) / ((y == y_i).sum() + 1)

x = trn_term_doc
test_x = test_term_doc

def get_mdl(y):
    y = y.values
    r = np.log(pr(1, y) / pr(0, y))
    m = LogisticRegression(C=4, max_iter=1000)
    x_nb = x.multiply(r)
    return m.fit(x_nb, y), r

m, r = get_mdl(train["target"])


# In[35]:


# Predictions
preds_probas = m.predict_proba(test_x.multiply(r))[:, 1]
preds = [1 if prob >= 0.5 else 0 for prob in preds_probas]


# In[36]:


# Evaluation
y_true = test.target.values
y_pred = preds
print("Confusion Matrix:\n", confusion_matrix(y_true, y_pred))
print("\nClassification Report:\n", classification_report(y_true, y_pred, target_names=["CG", "OR"]))
print(f"Accuracy: {accuracy_score(y_true, y_pred) * 100:.2f}%")
print(f"Precision: {precision_score(y_true, y_pred) * 100:.2f}%")
print(f"Recall: {recall_score(y_true, y_pred) * 100:.2f}%")


# In[46]:


# Load the new dataset for prediction
new_file_path = "myntra_reviews.csv"
new_data = pd.read_csv(new_file_path)

# Preprocess the new dataset
# Fill missing values in the 'Review' column
new_data['Review'] = new_data['Review'].fillna("unknown")

# Transform the 'Review' column using the trained TF-IDF vectorizer
new_reviews_tfidf = vec.transform(new_data['Review'])

# Make predictions using the trained model
new_preds_probas = m.predict_proba(new_reviews_tfidf.multiply(r))[:, 1]
new_preds = [1 if prob >= 0.5 else 0 for prob in new_preds_probas]

# Add predictions as a new column to the DataFrame
new_data['Prediction'] = new_preds
new_data['Prediction_Label'] = new_data['Prediction'].map({0: 'CG', 1: 'OR'})

# Display unique prediction values
unique_predictions = new_data['Prediction_Label'].unique()
print("\nUnique Prediction Labels:", unique_predictions)

# Count occurrences of each prediction label
prediction_counts = new_data['Prediction_Label'].value_counts()
print("\nPrediction Label Counts:\n", prediction_counts)

# Display examples of each class
for label in unique_predictions:
    print(f"\nExamples of {label} (Class: {label}):")
    examples = new_data[new_data['Prediction_Label'] == label][['Review', 'Prediction_Label']].head(20)
    print(examples)


# In[ ]:




