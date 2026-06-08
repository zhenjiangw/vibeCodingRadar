import schedule
import time
from crawler import update_trending_projects
import threading

def run_scheduler():
    schedule.every().day.at("02:00").do(update_trending_projects)
    
    while True:
        schedule.run_pending()
        time.sleep(60)

def start_scheduler():
    thread = threading.Thread(target=run_scheduler, daemon=True)
    thread.start()

if __name__ == "__main__":
    start_scheduler()
    while True:
        time.sleep(1)
