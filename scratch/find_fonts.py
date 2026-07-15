import os
for root, dirs, files in os.walk('frontend'):
    for f in files:
        if f.endswith('.woff2'):
            print(os.path.join(root, f))