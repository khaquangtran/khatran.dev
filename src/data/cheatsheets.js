export const cheatsheets = {
  AWS: [
    {
      title: 'Who am I?',
      code: 'aws sts get-caller-identity',
      note: 'Check the active identity and account.',
    },
    {
      title: 'List S3 buckets',
      code: 'aws s3 ls',
      note: 'Show buckets available to the active profile.',
    },
    {
      title: 'Sync a folder to S3',
      code: 'aws s3 sync ./dist s3://my-bucket/site/ --delete',
      note: 'Use --delete carefully: it removes remote files missing locally.',
    },
    {
      title: 'Switch profile',
      code: 'export AWS_PROFILE=dev',
      note: 'Select a named profile for this shell session.',
    },
  ],
  Docker: [
    {
      title: 'Build an image',
      code: 'docker build -t my-app:latest .',
      note: 'Build from the Dockerfile in the current directory.',
    },
    {
      title: 'Run a container',
      code: 'docker run --rm -p 8080:8080 my-app:latest',
      note: 'Publish port 8080 and remove the container when it exits.',
    },
    {
      title: 'Show running containers',
      code: 'docker ps',
      note: 'Add -a to include stopped containers.',
    },
    {
      title: 'Follow container logs',
      code: 'docker logs -f <container>',
      note: 'Stream logs from a container.',
    },
  ],
  Kubernetes: [
    { title: 'List pods', code: 'kubectl get pods -A', note: 'List pods across all namespaces.' },
    {
      title: 'Describe a pod',
      code: 'kubectl describe pod <name> -n <namespace>',
      note: 'Inspect events, conditions, and pod details.',
    },
    {
      title: 'Follow pod logs',
      code: 'kubectl logs -f <pod> -n <namespace>',
      note: 'Add -c <container> when the pod has multiple containers.',
    },
    {
      title: 'Roll out a restart',
      code: 'kubectl rollout restart deployment/<name> -n <namespace>',
      note: 'Restart pods managed by a deployment.',
    },
  ],
  Git: [
    {
      title: 'Show working tree',
      code: 'git status --short --branch',
      note: 'Compact status including the current branch.',
    },
    {
      title: 'Review a change',
      code: 'git diff --stat && git diff',
      note: 'See the size and content of unstaged changes.',
    },
    {
      title: 'Find a commit',
      code: 'git log --oneline --decorate -12',
      note: 'Show recent commits in a compact format.',
    },
    {
      title: 'Save a work in progress',
      code: 'git stash push -m "wip: note"',
      note: 'Store local changes temporarily.',
    },
  ],
}
