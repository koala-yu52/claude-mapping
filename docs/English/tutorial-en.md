# Claude Local Proxy for Chinese LLMs (Windows Edition)

> ⚠️ **For local learning and testing on `127.0.0.1` only. Public-network deployment and public relay services are strictly prohibited.**

Background: The latest Claude Desktop is more powerful than any Agent (including Codex), especially in project engineering and code. However, Anthropic blocks the Chinese mainland entirely, and the latest Claude Desktop has added official model detection, requiring model mapping. The most popular third-party proxy, CCswitch, stole my tokens — so after extensive experimentation, I implemented model mapping and proxying locally with a self-written script.

Step-by-step tutorial:

1. Prerequisite: download claude-mapping.zip and extract it (no need to open it yet; there are no path requirements)

2. Using a VPN, download and install Claude Desktop from the official Claude website. This step requires a stable VPN node — try not to switch nodes midway.

   ![Install Claude Desktop](../../assets/step1.png)

3. After installation, open Claude Desktop (do not disconnect the VPN) to enter the usage page (do NOT click "Start using"). Click the three bars in the top-left corner.

   ![Open the usage page](../../assets/step2.jpeg)

4. Click in order: **Developer → Configure third-party inference**, and keep that page open. (If there is no Developer option, enable it in Help and restart the app.)

   ![Configure third-party inference](../../assets/step3.png)

5. Open mapping.json in the claude-mapping folder, fill in the url and API-key, then save and exit. (Getting the url and API-key is straightforward — just apply on your model provider's open platform — so it won't be covered here.)

   ![Edit mapping.json](../../assets/step4.png)

6. Open start-proxy in the claude-mapping folder. A terminal window will pop up — copy the local proxy url shown on the first line.

   ![Start start-proxy](../../assets/step5.png)

7. Paste the address you just copied into the Configure third-party inference page from step 4, and follow the screenshot for the other options. (The API-Key here can be anything.)

   ![Fill in the local proxy address](../../assets/step6.png)

8. In Model list, click **Add model**: in the top field enter the official Claude model name, and in the bottom field the model you want to map to — these must match the left and right columns of modelMap in mapping.json (see the step 5 screenshot). Click **Apply Changes**, fully quit Claude Desktop, then close the terminal opened in step 6.

   ![Add a model](../../assets/step7.png)

9. You have now finished the setup. From now on, before each use, first run start-proxy in claude-mapping, then open Claude Desktop. (Note: the first launch may require the VPN, because Claude's Harness environment needs to download over the network.)

   ![Setup complete](../../assets/step8.png)

Final notes:

To use a different model, just change the url, API-key and model configuration in Configure third-party inference and in mapping.json.

(This document is for personal learning and reference only. Modifying the listening address to a public network or setting up a public relay service is prohibited.)
