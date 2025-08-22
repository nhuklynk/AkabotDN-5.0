export default function AdminLoading() {
	return (
		<div className="p-6">
			<div className="h-4 w-40 bg-muted rounded animate-pulse mb-4" />
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="h-24 bg-muted rounded animate-pulse" />
				<div className="h-24 bg-muted rounded animate-pulse" />
			</div>
		</div>
	);
}


