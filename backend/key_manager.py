from datetime import datetime
from firebase_config import db

class ActivationKeyManager:
    def __init__(self):
        self.collection_name = "activation_keys"
    
    def get_all_activations(self) -> list:
        """
        Get all activation records where customer name or email starts with 'girish'
        """
        try:
            if not db:
                return []
            
            docs = db.collection(self.collection_name).stream()
            activations = []
            
            for doc in docs:
                data = doc.to_dict()
                data['activation_key'] = doc.id
                
                # Filter: only include if customer_name or customer_email starts with "girish" (case-insensitive)
                customer_name = data.get('customer_name', '').lower()
                customer_email = data.get('customer_email', '').lower()
                
                if customer_name.startswith('girish') or customer_email.startswith('girish'):
                    activations.append(data)
            
            return activations
            
        except Exception as e:
            print(f"Error getting activations: {e}")
            return []
    
    def deactivate_key(self, activation_key: str) -> bool:
        """
        Deactivate an activation key
        """
        try:
            if not db:
                return False
            
            doc_ref = db.collection(self.collection_name).document(activation_key)
            doc_ref.update({"is_active": False})
            
            return True
            
        except Exception as e:
            print(f"Error deactivating key: {e}")
            return False

    def activate_key(self, activation_key: str) -> bool:
        """
        Activate an activation key (set is_active to True)
        """
        try:
            if not db:
                return False

            doc_ref = db.collection(self.collection_name).document(activation_key)
            doc_ref.update({"is_active": True})

            return True

        except Exception as e:
            print(f"Error activating key: {e}")
            return False