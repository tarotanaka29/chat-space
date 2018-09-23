class GroupsController < ApplicationController
  def index
  end

	def new
    @group = Group.new
  end

	def create
		@group = Group.new(group_params)
		@group.users << current_user
		if @group.save
		  redirect_to root_path, notice: 'グループを作成しました'
		else
		  render :new
		end
	end

	def update
		if @group.update(group_params)
			redirect_to group_massages_path(@group), notice: 'グループを編集しました'
		end
	end

  private
  def group_params
  	params.require(:group).permit(:name, { :user_ids => {} })
  end

  def set_group
  	@group = Group.find(params[:id])
  end
end
