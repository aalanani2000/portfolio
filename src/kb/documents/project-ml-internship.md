# Project: ML Internship Project (Codveda)

Four end-to-end classical machine learning tasks executed and evaluated in Google Colab, with trained model artifacts persisted (.pkl files). Author: Abdulrahman Alanani (مشروع تدريب تعلم الآلة).

## Verified results (from executed notebook outputs)

1. House price prediction — Linear Regression with feature scaling on the California Housing dataset (longitude/latitude/median_income features). R² ≈ 0.66, MSE ≈ 4.63e9. Saved artifacts: linear_regression_house.pkl + house_scaler.pkl.
2. Sentiment classification — TF-IDF vectorization → MLPClassifier neural network (128-unit hidden layer), RandomOverSampler for class imbalance. Accuracy ≈ 0.80 (weighted F1 ≈ 0.80) across negative/neutral/positive classes. Saved: sentiment_mlp_model.pkl.
3. Churn prediction — RandomForestClassifier (200 trees) with categorical encoding. Accuracy ≈ 0.95, ROC AUC ≈ 0.886; minority churn class F1 ≈ 0.80. Saved: churn_rf_model.pkl.
4. Stock data visualization — time-series trend analysis with 30-day moving averages.

## Honest note

The repository README mentions Boston Housing, but the actual dataset columns are California Housing — the notebook is the source of truth.
