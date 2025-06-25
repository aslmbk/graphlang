import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";

interface FeedbackModalProps {
  actorName: string;
  pros: string[];
  cons: string[];
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal = ({
  actorName,
  pros,
  cons,
  isOpen,
  onClose,
}: FeedbackModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">
              Feedback for {actorName}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              ✕
            </Button>
          </div>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {/* Pros Section */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="default" className="bg-green-500 text-white">
                  Pros ({pros.length})
                </Badge>
              </div>
              {pros.length > 0 ? (
                <div className="space-y-2">
                  {pros.map((pro, index) => (
                    <Card
                      key={index}
                      className="p-3 bg-green-50 border-green-200"
                    >
                      <p className="text-sm text-green-800">✓ {pro}</p>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-3 bg-gray-50 border-gray-200">
                  <p className="text-sm text-gray-600">No pros found</p>
                </Card>
              )}
            </div>

            <Separator />

            {/* Cons Section */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="default" className="bg-red-500 text-white">
                  Cons ({cons.length})
                </Badge>
              </div>
              {cons.length > 0 ? (
                <div className="space-y-2">
                  {cons.map((con, index) => (
                    <Card key={index} className="p-3 bg-red-50 border-red-200">
                      <p className="text-sm text-red-800">✗ {con}</p>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-3 bg-gray-50 border-gray-200">
                  <p className="text-sm text-gray-600">No cons found</p>
                </Card>
              )}
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
