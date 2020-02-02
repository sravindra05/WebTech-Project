kubectl apply -f auth_base.yaml
kubectl apply -f bank_base.yaml
kubectl apply -f genesis.yaml
kubectl apply -f bank_server.yaml
kubectl apply -f svc_create.yaml
echo "Setup complete"
