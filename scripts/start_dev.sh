#!/usr/bin/env bash
set -e

python3 data_loader.py
exec streamlit run app.py --server.port 3000 --server.address 0.0.0.0 --server.headless true --browser.gatherUsageStats false --server.enableCORS false --server.enableXsrfProtection false
