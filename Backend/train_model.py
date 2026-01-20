import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report, accuracy_score
import pickle
import re

class CommentQualityTrainer:
    def __init__(self):
        self.model = None
        self.vectorizer = None
        
    def create_training_data(self):
        """Create synthetic training data for comment quality classification"""
        
        # High quality comments (label: 2)
        high_quality = [
            "Calculate the Fibonacci sequence iteratively to avoid stack overflow for large numbers",
            "Validate user input to prevent SQL injection attacks before querying database",
            "Use binary search because the list is sorted, reducing time complexity to O(log n)",
            "Cache results to avoid redundant API calls and improve performance",
            "Handle edge case where the array might be empty to prevent index errors",
            "Convert to UTC timezone before storage to maintain consistency across regions",
            "Apply rate limiting to prevent abuse and protect server resources",
            "Sanitize filename to remove special characters that could cause file system errors",
            "Use exponential backoff for retries to avoid overwhelming the external service",
            "Normalize data to ensure consistent comparison between different sources",
        ]
        
        # Medium quality comments (label: 1)
        medium_quality = [
            "TODO: Optimize this function later",
            "Initialize variables",
            "Loop through items",
            "Return the result",
            "Check if valid",
            "Process the data",
            "FIXME: This might break in production",
            "Get user information",
            "Sort the array",
            "Update the counter",
        ]
        
        # Low quality comments (label: 0)
        low_quality = [
            "code",
            "function",
            "x",
            "test",
            "comment",
            "i++",
            "end",
            "return",
            "set value",
            "get value",
        ]
        
        # Create dataset
        comments = high_quality + medium_quality + low_quality
        labels = [2]*len(high_quality) + [1]*len(medium_quality) + [0]*len(low_quality)
        
        return pd.DataFrame({'comment': comments, 'quality': labels})
    
    def extract_features(self, comment):
        """Extract features from comment text"""
        features = {}
        
        # Length features
        features['length'] = len(comment)
        features['word_count'] = len(comment.split())
        
        # Capitalization
        features['starts_capital'] = 1 if comment and comment[0].isupper() else 0
        
        # Punctuation
        features['has_period'] = 1 if '.' in comment else 0
        
        # Action markers
        features['has_todo'] = 1 if re.search(r'\b(TODO|FIXME|HACK)\b', comment, re.IGNORECASE) else 0
        
        # Explanatory words
        explanatory_words = ['because', 'since', 'to', 'for', 'when', 'if', 'prevent', 'avoid', 'ensure']
        features['has_explanation'] = 1 if any(word in comment.lower() for word in explanatory_words) else 0
        
        # Technical depth
        technical_words = ['algorithm', 'complexity', 'optimize', 'performance', 'error', 'exception', 'validate']
        features['technical_depth'] = sum(1 for word in technical_words if word in comment.lower())
        
        return features
    
    def train(self):
        """Train the comment quality classifier"""
        
        # Create training data
        df = self.create_training_data()
        
        print(f"Training with {len(df)} samples")
        print(f"Label distribution:\n{df['quality'].value_counts()}")
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            df['comment'], df['quality'], test_size=0.2, random_state=42
        )
        
        # Create pipeline with TF-IDF and Random Forest
        self.model = Pipeline([
            ('tfidf', TfidfVectorizer(max_features=100, ngram_range=(1, 2))),
            ('clf', RandomForestClassifier(n_estimators=100, random_state=42))
        ])
        
        # Train
        self.model.fit(X_train, y_train)
        
        # Evaluate
        y_pred = self.model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        
        print(f"\nModel Accuracy: {accuracy:.2f}")
        print("\nClassification Report:")
        print(classification_report(y_test, y_pred, 
                                    target_names=['Low', 'Medium', 'High']))
        
        return self.model
    
    def save_model(self, filepath='comment_quality_model.pkl'):
        """Save trained model to disk"""
        with open(filepath, 'wb') as f:
            pickle.dump(self.model, f)
        print(f"\nModel saved to {filepath}")
    
    def load_model(self, filepath='comment_quality_model.pkl'):
        """Load trained model from disk"""
        with open(filepath, 'rb') as f:
            self.model = pickle.load(f)
        return self.model
    
    def predict_quality(self, comment):
        """Predict quality of a single comment"""
        if self.model is None:
            raise ValueError("Model not trained or loaded")
        
        prediction = self.model.predict([comment])[0]
        proba = self.model.predict_proba([comment])[0]
        
        quality_map = {0: 'Low', 1: 'Medium', 2: 'High'}
        
        return {
            'quality': quality_map[prediction],
            'confidence': float(max(proba)),
            'score': float(prediction * 50)  # Convert to 0-100 scale
        }

# Training script
if __name__ == "__main__":
    trainer = CommentQualityTrainer()
    
    print("Training Comment Quality Model...")
    print("="*50)
    
    # Train model
    model = trainer.train()
    
    # Save model
    trainer.save_model()
    
    # Test predictions
    print("\n" + "="*50)
    print("Testing Predictions:")
    print("="*50)
    
    test_comments = [
        "Use binary search to optimize lookup time complexity",
        "TODO: fix this",
        "x",
        "Validate input to prevent injection attacks",
    ]
    
    for comment in test_comments:
        result = trainer.predict_quality(comment)
        print(f"\nComment: '{comment}'")
        print(f"Quality: {result['quality']} (Score: {result['score']:.1f}, Confidence: {result['confidence']:.2f})")
    
    print("\n✓ Training complete!")