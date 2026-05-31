<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->


## 📄 Pages

### 1. Dashboard (`/dashboard`)
Shows:
- Top priority task
- Recent PRs
- Open issues
- Slack activity

---

### 2. Work Details (`/work/:id`)
Shows:
- GitHub issue/PR details
- Related Slack messages
- AI explanation of issue

---

### 3. Activity Feed (`/activity`)
Shows:
- Combined GitHub + Slack timeline
- Recent updates across project

---

### 4. Recommendations (`/recommendation`)
Shows:
- What you should work on next
- Priority-based task list
- Reason for each suggestion

---