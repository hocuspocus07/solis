import json
import sys
import os
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import confusion_matrix, accuracy_score, precision_score, recall_score, classification_report
import re, string

sys.stdout.reconfigure(encoding='utf-8')

#loading dataset
scriptDir = os.path.dirname(os.path.abspath(__file__))
filePath = os.path.join(scriptDir, "data", "fakeReviewsDataset.csv")
data = pd.read_csv(filePath)
df = data

encodedLabelDict = {"CG": 0, "OR": 1}  # CG is computer-generated, OR is original
df["target"] = df["label"].apply(lambda x: encodedLabelDict.get(x, -1))

train, test = train_test_split(df, test_size=0.2, shuffle=True, random_state=2025) #train-test split

#filling empty rows
comment = 'text_'  
train[comment] = train[comment].fillna("unknown")
test[comment] = test[comment].fillna("unknown")

#cleaning
reTok = re.compile(f'([{string.punctuation}“”¨«»®´·º½¾¿¡§£₤‘’])')
def tokenize(text):
    return reTok.sub(r' \1 ', text).split()

#vectorization train and test sets
vectorizer = TfidfVectorizer(
    ngram_range=(1, 2),
    tokenizer=tokenize, min_df=3, max_df=0.9,
    strip_accents='unicode', use_idf=True,
    smooth_idf=True, sublinear_tf=True, =None
)

trainTerm = vectorizer.fit_transform(train[comment])
testTerm = vectorizer.transform(test[comment])


#calculating class probability (using Naive Bayes) 
def pr(yVal, y):
    p = x[y == yVal].sum(0)
    return (p + 1) / ((y == yVal).sum() + 1)

x = trainTerm
testX = testTerm

#ca
def getModel(y):
    y = y.values
    r = np.log(pr(1, y) / pr(0, y))
    model = LogisticRegression(C=4, max_iter=1000)
    xNb = x.multiply(r)
    return model.fit(xNb, y), r

model, r = getModel(train["target"])

#making predictions
predsProbas = model.predict_proba(testX.multiply(r))[:, 1]
preds = [1 if prob >= 0.5 else 0 for prob in predsProbas]

 
#yTrue = test.target.values
# yPred = preds

# evaluationResults = {
#     "accuracy": round(accuracy_score(yTrue, yPred) * 100, 2),
#     "precision": round(precision_score(yTrue, yPred) * 100, 2),
#     "recall": round(recall_score(yTrue, yPred) * 100, 2),
#     "confusionMatrix": confusion_matrix(yTrue, yPred).tolist()
# }


#predicting on scraped dataset
newFilePath = os.path.join(scriptDir, "data", "myntraReviews.csv")
newData = pd.read_csv(newFilePath)
newData['Review'] = newData['Review'].fillna("unknown")

#Applying trained model
newReviewsTfidf = vectorizer.transform(newData['Review'])
newPredsProbas = model.predict_proba(newReviewsTfidf.multiply(r))[:, 1]
newPreds = [1 if prob >= 0.5 else 0 for prob in newPredsProbas]

#making a new csv file
newData['Prediction'] = newPreds
newData['PredictionLabel'] = newData['Prediction'].map({0: 'CG', 1: 'OR'})
predictionsData = {
    "predictionCounts": newData["PredictionLabel"].value_counts().to_dict(),
    "examples": newData[["Review", "PredictionLabel"]].head(10).to_dict(orient="records")
}

# results = {
#     "evaluationResults": evaluationResults,
#     "predictionsData": predictionsData
# }


#saving the predictions
predictedFilePath = os.path.join(scriptDir, "data", "predictedReviews.csv")
newData.to_csv(predictedFilePath, index=False)

predictedData = pd.read_csv(predictedFilePath)

#confidence in the product
predictedFilePath = os.path.join(scriptDir, "data", "predictedReviews.csv")
predictedData = pd.read_csv(predictedFilePath)

if "PredictionProba" not in predictedData.columns:
    raise ValueError("Ensure 'PredictionProba' column exists in the predicted dataset.")

topOriginal = predictedData[predictedData["PredictionLabel"] == "OR"].nlargest(10, "PredictionProba")
topComputerGenerated = predictedData[predictedData["PredictionLabel"] == "CG"].nlargest(5, "PredictionProba")
originalPercentage = (predictedData["PredictionLabel"] == "OR").mean() * 100



#stating confidence by probability
if originalPercentage >= 90:
    productLegitimacy = "We're sure the product you're looking for is legit. Just close your eyes and buy it!"
elif originalPercentage >= 75:
    productLegitimacy = "Majority of the reviews are originally written, we'd personally buy it."
elif originalPercentage >= 50:
    productLegitimacy = "We're not so confident about this one as the reviews are mixed, take caution before buying."
else:
    productLegitimacy = "This product is most probably not reliable. Most of the reviews for this product are computer generated."

#results to be displayed
analysisResults = {
    "topOriginalReviews": topOriginal[["Review", "PredictionProba"]].to_dict(orient="records"),
    "topFakeReviews": topComputerGenerated[["Review", "PredictionProba"]].to_dict(orient="records"),
    "originalPercentage": round(originalPercentage, 2),
    "productLegitimacy": productLegitimacy
}

#JSON code
print(json.dumps(analysisResults, indent=4))
print(json.dumps(results))



